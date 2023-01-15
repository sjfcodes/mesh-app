import ItemCard from '../../components/ItemCard';
import usePlaidItems from '../../hooks/usePlaidItems';

const PlaidItemsPage = () => {
  const { sortedItems } = usePlaidItems();
  // const { generateLinkToken } = useLink();
  // const handleInitiateLink = async () => {
  //   await generateLinkToken(user.sub, null);
  // };

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
