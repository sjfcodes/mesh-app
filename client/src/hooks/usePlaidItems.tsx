import { useContext } from 'react';
import { ItemsContext } from '../services/Plaid/Items/Provider';

/**
 * @desc A convenience hook to provide access to the Items context state in components.
 */
const usePlaidItems = () => {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error(`usePlaidItems must be used within an ItemsProvider`);
  }

  return context;
};

export default usePlaidItems;
