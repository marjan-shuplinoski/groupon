import PageLayout from '../../components/PageLayout';

const Categories = () => {
  const categories = [
    'Food & Drink',
    'Beauty & Spas',
    'Health & Fitness',
    'Home & Garden',
    'Electronics',
    'Travel',
    'Activities',
    'Automotive',
    'Retail',
    'Education',
  ];

  return (
    <PageLayout title="Categories">
      <div className="row">
        {categories.map((category, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className="p-3 bg-teal-light rounded-3 text-center">
              <h4>{category}</h4>
              <button className="btn btn-light btn-sm">View Deals</button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Categories;
