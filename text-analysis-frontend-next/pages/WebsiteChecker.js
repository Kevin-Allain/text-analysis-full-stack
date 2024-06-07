import withAuth from '@/components/WithAuth';

const WebsiteChecker = () => {
    return (
      <div>
        <h1>Website Checker Page</h1>
      </div>
    );
  };
  
  export default withAuth(WebsiteChecker);
  