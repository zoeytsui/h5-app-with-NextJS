import { useEffect } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/globals.scss'
import Layout from '../components/layout'

import { Provider } from "react-redux";
import { wrapper, store } from '../redux/store';

function App({ Component, pageProps }) {
  useEffect(() => {
    (() => {
      var obj = document.getElementById('__next');
      obj.addEventListener('touchmove', function (event) {
        console.log(`touchmove ${event.targetTouches.length}`);
        if (event.targetTouches.length == 2) {
          console.log("success");
          return event.preventDefault()
        }
      }, false);
    })()
  })
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossOrigin="anonymous" />
    </>
  )
}

export default appWithTranslation(wrapper.withRedux(App))
