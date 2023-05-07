import { useContext } from 'react';
import { AppContext } from '../services/App/Provider';

const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};

export default useAppContext;
