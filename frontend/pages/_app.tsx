import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { MainLayout } from "../layouts/MainLayout";
import { store } from "../store/index";
import { ToastContainer } from "react-toastify";
import { NoAccess } from "../components/NoAccess";
import { checkCredentials } from "../utils/checkCredentials";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  <Head>
    <link rel="shortcut icon" href="/public/favicon.ico" />
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
