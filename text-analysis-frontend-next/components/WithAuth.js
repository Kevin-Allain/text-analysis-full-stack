import { useEffect } from 'react';
import { useRouter } from 'next/router';

const WithAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = localStorage.getItem('authenticated');
      if (!isAuthenticated) {
        router.push('/');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
