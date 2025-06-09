import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageLayout from '../../components/PageLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import { registerUser, registerMerchant } from '../../services/authService';
import type { 
  RegisterFormData, 
  UserRegisterData, 
  MerchantRegisterData 
} from '../../types/auth';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      // Make API call based on user type
      if (values.role === 'merchant') {
        const merchantData = values as MerchantRegisterData;
        const response = await registerMerchant(merchantData);
        if (response) {
          toast.success('Merchant account created successfully! Please check your email to verify your account.');
          navigate('/merchant/dashboard');
        }
      } else {
        const userData = values as UserRegisterData;
        const response = await registerUser(userData);
        if (response) {
          toast.success('Account created successfully! Welcome to Groupon Clone.');
          navigate('/deals');
        }
      }
    } catch (error: unknown) {
      let message = 'Registration failed. Please try again.';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { status?: number; data?: { message?: string; error?: string } } };
        const status = err.response?.status;
        if (status === 409) {
          message = 'An account with this email already exists.';
        } else if (status === 400) {
          message = err.response?.data?.message || 'Invalid registration data.';
        } else if (status === 500) {
          message = 'Server error. Please try again later.';
        } else {
          message = err.response?.data?.message || err.response?.data?.error || message;
        }
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Register Your Account">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Register on Groupon Clone</h2>
              <p className="text-center text-muted mb-4">
                Sign up to discover amazing deals and save money on your favorite products and services.
              </p>
              <RegisterForm onSubmit={handleSubmit} loading={loading} />
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    className="text-primary" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;
