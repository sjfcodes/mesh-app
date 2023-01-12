import { useContext } from 'react';
import { ErrorsContext } from '../services/Errors/Provider';

/**
 * @desc A convenience hook to provide access to the Errors context state in components.
 */
const useErrors = () => {
  const context = useContext(ErrorsContext);

  if (!context) {
    throw new Error(`useErrorsmust be used within an ErrorsProvider`);
  }

  return context;
};

export default useErrors;
