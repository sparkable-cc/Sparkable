import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { MainLayout } from "../layouts/MainLayout";
import { store } from "../store/index";
import { ToastContainer } from "react-toastify";
import { NoAccess } from "../components/NoAccess";
import { checkCredentials } from "../utils/checkCredentials";

export default function App({ Component, pageProps }: AppProps) {
  if (pageProps.protected && checkCredentials()) {
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
