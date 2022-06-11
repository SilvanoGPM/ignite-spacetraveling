import { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/global.scss';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default App;
