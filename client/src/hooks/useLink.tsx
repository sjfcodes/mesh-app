import { useContext } from 'react';
import { LinkContext } from '../services/Plaid/Link/Provider';

/**
 * @desc A convenience hook to provide access to the Link context state in components.
 */
const useLink = () => {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error(`useLink must be used within a LinkProvider`);
  }

  return context;
};

export default useLink;
