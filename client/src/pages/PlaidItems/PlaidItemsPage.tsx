import ItemCard from '../../components/ItemCard';
import usePlaidItems from '../../hooks/usePlaidItems';

const PlaidItemsPage = () => {
  const { sortedItems } = usePlaidItems();

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
