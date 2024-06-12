import React from 'react';
import { FormDataProvider } from '@/components/context/FormDataContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormDataProvider>
      <Component {...pageProps} />
    </FormDataProvider>
  );
}

export default MyApp;
