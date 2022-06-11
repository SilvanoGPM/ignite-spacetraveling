import { AppProps } from 'next/app';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Next Boilerplate</title>

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="description" content="Boilerplate for NextJS projects" />
        <meta name="theme-color" content="#FFFFFF" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default App;
