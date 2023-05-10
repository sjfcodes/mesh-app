import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Amplify } from '@aws-amplify/core/lib-esm/Amplify';
// import { toast } from 'react-toastify';
import '@aws-amplify/ui-react/styles.css';
// import 'react-toastify/dist/ReactToastify.min.css';

import currentConfig from './auth/config';
import { LinkProvider } from './services/Plaid/Link/Provider';
import { InstitutionsProvider } from './services/Plaid/Institutions/Provider';
import { TransactionsProvider } from './services/Plaid/Transactions/Provider';
import { AssetsProvider } from './services/Assets/Provider';
import { ErrorsProvider } from './services/Errors/Provider';
import { ItemsProvider } from './services/Plaid/Items/Provider';
import CustomAuthenticator from './components/CustomAuthenticator';
import Header from './components/Header/Header';
import NavBar from './components/FooterNav/FooterNav';

import { ROUTE } from './util/constants';

import './App.scss';
const TxSearchFilter = lazy(
  () => import('./components/TxSearchFilter/TxSearchFilter')
);
const TimeLine = lazy(() => import('./pages/Timeline/Timeline'));
const PlaidItemsPage = lazy(() => import('./pages/PlaidItems/PlaidItemsPage'));
const SpendingInsights = lazy(
  () => import('./pages/SpendingInsights/SpendingInsightsPage')
);

Amplify.configure(currentConfig);

const App = () => {
  // toast.configure({
  //   autoClose: 8000,
  //   draggable: false,
  //   toastClassName: 'box toast__background',
  //   bodyClassName: 'toast__body',
  //   hideProgressBar: true,
  // });
  return (
    <CustomAuthenticator>
      <InstitutionsProvider>
        <ItemsProvider>
          <LinkProvider>
            <TransactionsProvider>
              <ErrorsProvider>
                <AssetsProvider>
                  {/* <div className="toast__body"></div> */}
                  <Suspense>
                    <Header />
                    <TxSearchFilter />
                    <Routes>
                      <Route path="/" element={<TimeLine />} />
                      <Route
                        path={ROUTE.ACCOUNTS}
                        element={<PlaidItemsPage />}
                      />
                      <Route path={ROUTE.TRANSACTIONS} element={<TimeLine />} />
                      <Route
                        path={ROUTE.SPENDING}
                        element={<SpendingInsights />}
                      />
                    </Routes>
                    <NavBar />
                  </Suspense>
                </AssetsProvider>
              </ErrorsProvider>
            </TransactionsProvider>
          </LinkProvider>
        </ItemsProvider>
      </InstitutionsProvider>
    </CustomAuthenticator>
  );
};

export default App;
