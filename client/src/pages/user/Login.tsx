import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageLayout from '../../components/PageLayout';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Check if we have a remembered email in localStorage
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    // Clean up function to remove the remembered email if the component unmounts
    return () => {
      if (!rememberMe && email) {
        localStorage.removeItem('rememberedEmail');
      }
    };
  }, [email, rememberMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }
    
    setLoading(true);

    try {
      // Store email in localStorage if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Call the login function from auth context
      await login(email.trim(), password.trim(), rememberMe);
      
      // On successful login, the AuthContext will handle redirection
    } catch (err: any) {
      console.error('Login error details:', err);
      
      // Extract error message from the error object
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response) {
        // Handle API response errors
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      errorMessage;
      } else if (err.message) {
        // Handle other errors with messages
        errorMessage = err.message;
      }
      
      // Show error message to user
      toast.error(errorMessage);
      
      // Clear sensitive data on error
      if (!rememberMe) {
        setPassword('');
      }
      
      // Ensure we don't redirect by returning early
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Login">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <button 
              type="submit" 
              className="btn btn-light"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="mt-3">
              <p className="mb-0">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="text-light"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
