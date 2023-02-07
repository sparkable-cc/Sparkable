import "../styles/globals.scss";
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { MainLayout } from "../layouts/MainLayout";
import { store } from "../store/index";
import { ToastContainer } from 'react-toastify';

// TO-DO:
// private route
// check is token does not expire, clear if so
// auth buttons visibility 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <ToastContainer />
    </Provider>
  );
}
