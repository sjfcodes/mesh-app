import { useContext } from 'react';
import { UserContext } from '../services/User/Provider';

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(`useUser must be used within UserProvider`);
  }

  return context;
};

export default useUser;
