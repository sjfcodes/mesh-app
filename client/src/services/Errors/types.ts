export interface ErrorsState {
  code?: string;
  message?: string;
}

export type ErrorsAction =
  | {
      type: 'SET_ERROR';
      payload: ErrorsState;
    }
  | {
      type: 'RESET_ERROR';
      payload: ErrorsState;
    };

export interface ErrorsContextShape extends ErrorsState {
  setError: (code: string, message: string | null) => void;
  error: { code: string; message: string };
  resetError: () => void;
}
