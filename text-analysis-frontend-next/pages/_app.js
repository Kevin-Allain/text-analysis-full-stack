import React from 'react';
import { FormDataProvider } from '@/components/FormDataContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormDataProvider>
      <Component {...pageProps} />
    </FormDataProvider>
  );
}

export default MyApp;
