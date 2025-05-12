import PageLayout from '../components/PageLayout';

const Deals = () => {
  return (
    <PageLayout title="All Deals">
      <div className="row">
        {[1, 2, 3, 4, 5, 6].map((deal) => (
          <div key={deal} className="col-md-4 mb-4">
            <div className="card bg-teal-light border-0 h-100">
              <div className="card-body">
                <h5 className="card-title">Deal {deal}</h5>
                <p className="card-text">Amazing deal description goes here. Limited time offer!</p>
                <button className="btn btn-light">View Deal</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Deals;
