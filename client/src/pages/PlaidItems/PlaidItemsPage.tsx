import ButtonLinkBank from '../../components/ButtonLinkBank/ButtonLinkBank';
import ItemCard from '../../components/ItemCard/ItemCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import usePlaidItems from '../../hooks/usePlaidItems';

import './style.scss';

const PlaidItemsPage = () => {
  const { sortedItems } = usePlaidItems();

  return (
    <main id="ma-plaid-items-page">
      <SectionHeader text="accounts" />

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
