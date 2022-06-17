import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';

import SEO from '../../next-seo.config';

import '../styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Home - Spacetraveling</title>

        <meta name="theme-color" content="#FF57B2" />

        <meta
          name="description"
          content="Viage nas informações com Spacetraveling, o melhor blog sobre o universo React."
        />
      </Head>

      <DefaultSeo {...SEO} />

      <NextNProgress
        color="#FF57B2"
        startPosition={0.3}
        stopDelayMs={200}
        height={4}
      />

      <Component {...pageProps} />
    </>
  );
}
