import ButtonLinkBank from '../../components/ButtonLinkBank/ButtonLinkBank';
import ItemCard from '../../components/ItemCard/ItemCard';
import usePlaidItems from '../../hooks/usePlaidItems';

import './style.scss';

const PlaidItemsPage = () => {
  const { sortedItems } = usePlaidItems();

  return (
    <main id="ma-plaid-items-page">
      <div>
        {sortedItems.map((item) => (
          <div id="itemCards" key={item.id}>
            <ItemCard item={item} />
          </div>
        ))}
      </div>
      <div className="add-item">
        <ButtonLinkBank />
      </div>
    </main>
  );
};

export default PlaidItemsPage;
