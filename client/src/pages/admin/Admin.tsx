import PageLayout from '../../components/PageLayout';

const Admin = () => {
  return (
    <PageLayout title="Admin Dashboard">
      <div className="text-center">
        <h2>Administrator Panel</h2>
        <p>Manage users, merchants, and site content.</p>
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 h-100">
              <h4>Users</h4>
              <p>Manage user accounts and permissions</p>
              <button className="btn btn-light btn-sm">Manage</button>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 h-100">
              <h4>Merchants</h4>
              <p>Approve and manage merchant accounts</p>
              <button className="btn btn-light btn-sm">Manage</button>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 h-100">
              <h4>Deals</h4>
              <p>Review and manage all deals</p>
              <button className="btn btn-light btn-sm">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Admin;
