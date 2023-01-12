import { useContext } from 'react';
import { InstitutionsContext } from '../services/PlaidInstitutions/Provider';

/**
 * @desc A convenience hook to provide access to the Institutions context state in components.
 */
const useInstitutions = () => {
  const context = useContext(InstitutionsContext);

  if (!context) {
    throw new Error(
      `useInstitutions must be used within an InstitutionsProvider`
    );
  }

  return context;
};

export default useInstitutions;
