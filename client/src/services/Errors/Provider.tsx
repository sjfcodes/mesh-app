import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import errorsReducer from './reducer';
import { ErrorsContextShape, ErrorsState } from './types';

const initialState: ErrorsState = {};

export const ErrorsContext = createContext<ErrorsContextShape>(
  initialState as ErrorsContextShape
);

/**
 * @desc Maintains the Errors context state and provides functions to update that state.
 */
export const ErrorsProvider: React.FC<{ children: ReactNode }> = (
  props: any
) => {
  const [error, dispatch] = useReducer(errorsReducer, initialState);

  /**
   * @desc Sets error from onEvent callback.
   */
  const setError = useCallback(async (code: string, message: string) => {
    dispatch({
      type: 'SET_ERROR',
      payload: { code: code, message: message },
    });
  }, []);

  /**
   * @desc resets error from onSuccess callback.
   */
  const resetError = useCallback(async () => {
    dispatch({
      type: 'RESET_ERROR',
      payload: {},
    });
  }, []);

  /**
   * @desc  useMemo will prevent error
   *  from being rebuilt on every render unless error is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      error,
      setError,
      resetError,
    };
  }, [error, setError, resetError]);

  return <ErrorsContext.Provider value={value} {...props} />;
};
