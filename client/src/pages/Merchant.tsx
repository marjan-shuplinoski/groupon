import PageLayout from '../components/PageLayout';

const Merchant = () => {
  return (
    <PageLayout title="Merchant Dashboard">
      <div className="text-center">
        <h2>Welcome, Merchant!</h2>
        <p>Manage your deals and track your sales here.</p>
        <div className="mt-4">
          <button className="btn btn-light me-2">Add New Deal</button>
          <button className="btn btn-outline-light">View Analytics</button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Merchant;
