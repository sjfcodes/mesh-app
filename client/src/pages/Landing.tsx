import React /* useEffect */ from 'react';

import Header from '../components/Header/Header';
import ButtonLinkBank from '../components/ButtonLinkBank/ButtonLinkBank';
// import useApi from '../hooks/useApi';

function Landing() {
  // const { testLambda } = useApi();

  // useEffect(() => {
  //   (async () => {
  //     const get = await testLambda('GET');
  //     const post = await testLambda('POST');
  //     // console.log({ get, post });
  //   })();
  // }, [testLambda]);

  return (
    <main>
      <Header />
      <h1>Mesh</h1>
      <ButtonLinkBank />
    </main>
  );
}

export default Landing;
