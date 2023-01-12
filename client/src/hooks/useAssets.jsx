import { useContext } from 'react';
import { AssetsContext } from '../services/Assets/Provider';

const useAssets = () => {
  const context = useContext(AssetsContext);

  if (!context) {
    throw new Error(`useAssets must be used within a AssetsProvider`);
  }

  return context;
};

export default useAssets;
