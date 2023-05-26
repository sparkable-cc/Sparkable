import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { NoAccess } from "../components/NoAccess";
import { MainLayout } from "../layouts/MainLayout";
import { store } from "../store/index";
import { checkCredentials } from "../utils/checkCredentials";

export default function App({ Component, pageProps }: AppProps) {
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
