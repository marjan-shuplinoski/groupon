import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const isActive = (path: string) => {
    return activePath === path ? 'active' : '';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-teal mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Groupon Clone</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/deals')}`} to="/deals">Deals</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/admin/dashboard')}`} to="/admin/dashboard">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'merchant' && (
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/merchant/dashboard')}`} to="/merchant/dashboard">
                      Merchant Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'user' && (
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link" 
                    onClick={handleLogout}
                    style={{ backgroundColor: 'transparent', border: 'none' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login')}`} to="/login">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <Link 
                    className={`btn btn-outline-light ms-2 ${isActive('/register') ? 'active' : ''}`} 
                    to="/register"
                  >
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
