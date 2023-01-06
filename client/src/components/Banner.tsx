import { useAppContext } from '../services/currentUser';

interface Props {
  initialSubheading?: boolean;
}

const Banner = (props: Props) => {
  const {
    useUser: [user],
  } = useAppContext();
  const initialText =
    'This is an example app that outlines an end-to-end integration with Plaid.';

  const successText =
    "This page shows a user's net worth, spending by category, and allows them to explore account and transactions details for linked items.";

  const subheadingText = props.initialSubheading ? successText : initialText;

  return (
    <div id="banner" className="bottom-border-content">
      <h4> ENV: {process.env.REACT_APP_PLAID_ENV}</h4>
      <h4>Welcome {user?.attributes?.email}</h4>
      <div className="header">
        <h1 className="everpresent-content__heading">Plaid Pattern</h1>
      </div>
      <p id="intro" className="everpresent-content__subheading">
        {subheadingText}
      </p>
    </div>
  );
};

export default Banner;
