import React from 'react';
import { FormDataProvider } from '@/components/context/FormDataContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <FormDataProvider>
      <Component {...pageProps} />
    </FormDataProvider>
  );
}

export default MyApp;
