import { useEffect } from 'react';
import { useRouter } from 'next/router';

const WithAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    useEffect(() => {
      const isAuthenticated = localStorage.getItem('authenticated');
      if (!isAuthenticated) {
        router.push('/');
      }
    }, [router]);
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  return AuthComponent;
};

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default WithAuth;
