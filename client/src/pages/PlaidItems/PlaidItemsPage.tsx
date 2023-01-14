import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import ItemCard from '../../components/ItemCard';
import { ItemType } from '../../types';
import usePlaidItems from '../../hooks/usePlaidItems';

const PlaidItemsPage = () => {
  const { plaidItem } = usePlaidItems();
  const [sortedItems, setSortedItems] = useState([] as ItemType[]);

  // update state sortedItems from data store
  useEffect(() => {
    const newItems: ItemType[] = plaidItem ? Object.values(plaidItem) : [];
    const orderedItems = sortBy(
      newItems,
      (item) => new Date(item.updated_at)
    ).reverse();
    setSortedItems(orderedItems);
  }, [plaidItem]);

  return (
    <main>
      {sortedItems.map((item) => (
        <div id="itemCards" key={item.id}>
          <ItemCard item={item} />
        </div>
      ))}
    </main>
  );
};

export default PlaidItemsPage;
