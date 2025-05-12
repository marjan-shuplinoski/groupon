import PageLayout from '../components/PageLayout';

const Login = () => {
  return (
    <PageLayout title="Login">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" required />
            </div>
            <button type="submit" className="btn btn-light">Login</button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
