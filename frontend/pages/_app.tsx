import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { NoAccess } from '../components/NoAccess';
import { MainLayout } from '../layouts/MainLayout';
import { store } from '../store/index';
import { checkCredentials } from '../utils/checkCredentials';

export default function App({ Component, pageProps }: AppProps) {
  <Head>
    <link rel="shortcut icon" href="/public/favicon.ico" />
    <title>Sparkable</title>
    <meta
      name="description"
      content="Discover links that spark new understanding."
    />
    {/* <!-- Facebook Meta Tags --> */}
    <meta property="og:url" content="https://www.sparkable.cc" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Sparkable" />
    <meta property="og:description" content="Discover links that spark new understanding." />
    <meta property="og:image" content="https://sparkable.cc/public/og-image.png" />
    {/* <!-- Twitter Meta Tags --> */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="sparkable.cc" />
    <meta property="twitter:url" content="https://www.sparkable.cc" />
    <meta name="twitter:title" content="Sparkable" />
    <meta name="twitter:description" content="Discover links that spark new understanding." />
    <meta name="twitter:image" content="https://sparkable.cc/public/og-image.png" />

  </Head>;

  if (pageProps.protected && !checkCredentials()) {
    return (
      <Provider store={store}>
        <MainLayout>
          <NoAccess />
        </MainLayout>
      </Provider>
    );
  }
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <ToastContainer />
    </Provider>
  );
}
