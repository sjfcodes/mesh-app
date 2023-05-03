import {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { handleLinkTokenCreateUpdate } from '../../../util/api';
import linkReducer from './reducer';
import { LinkContextShape } from './types';

const initialState = {
  byUser: {}, // normal case
  byItem: {}, // update mode
  error: {},
};

export const LinkContext = createContext<LinkContextShape>(
  initialState as LinkContextShape
);

/**
 * @desc Maintains the Link context state and fetches link tokens to update that state.
 */
export function LinkProvider(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [linkTokens, dispatch] = useReducer(linkReducer, initialState);

  /**
   * @desc Creates a new link token for a given User or Item.
   */

  const generateLinkToken = useCallback(
    async (userId: string, itemId: string | null) => {
      setIsLoading(true);
      // if itemId is not null, update mode is triggered
      const {
        data: { data },
      } = await handleLinkTokenCreateUpdate(itemId);
      if (data.link_token) {
        const token = data.link_token;
        console.log('success', data);

        if (itemId != null) {
          dispatch({
            type: 'LINK_TOKEN_UPDATE_MODE_CREATED',
            id: itemId,
            token: token,
          });
        } else {
          dispatch({ type: 'LINK_TOKEN_CREATED', id: userId, token: token });
        }
      } else {
        dispatch({ type: 'LINK_TOKEN_ERROR', error: data });
        console.log('error', data);
      }
      setIsLoading(false);
    },
    []
  );

  const deleteLinkToken = useCallback(
    async (userId: string, itemId: string) => {
      if (userId != null) {
        dispatch({
          type: 'DELETE_USER_LINK_TOKEN',
          id: userId,
        });
      } else {
        dispatch({
          type: 'DELETE_ITEM_LINK_TOKEN',
          id: itemId,
        });
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      isLoading,
      linkTokens,
      deleteLinkToken,
      generateLinkToken,
    }),
    [isLoading, linkTokens, generateLinkToken, deleteLinkToken]
  );

  return <LinkContext.Provider value={value} {...props} />;
}
