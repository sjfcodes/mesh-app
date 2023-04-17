import { createContext, useCallback, useMemo, useReducer } from 'react';
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
  const [linkTokens, dispatch] = useReducer(linkReducer, initialState);

  /**
   * @desc Creates a new link token for a given User or Item.
   */

  const generateLinkToken = useCallback(
    async (userId: string, itemId: string | null) => {
      // if itemId is not null, update mode is triggered
      const {
        data: { body },
      } = await handleLinkTokenCreateUpdate(itemId);
      if (body.link_token) {
        const token = body.link_token;
        console.log('success', body);

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
        dispatch({ type: 'LINK_TOKEN_ERROR', error: body });
        console.log('error', body);
      }
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
      generateLinkToken,
      deleteLinkToken,
      linkTokens,
    }),
    [linkTokens, generateLinkToken, deleteLinkToken]
  );

  return <LinkContext.Provider value={value} {...props} />;
}
