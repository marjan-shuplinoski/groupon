import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Merchant from './pages/merchant/Merchant';
import Admin from './pages/admin/Admin';
import Deals from './pages/user/Deals';
import DealDetails from './pages/user/DealDetails';
import UserDashboard from './pages/user/UserDashboard';
import './App.css';

// Protected route component
const ProtectedRoute = ({ requiredRole, redirectTo = '/login' }: { requiredRole?: string, redirectTo?: string }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {

  return (
    <AuthProvider>
      <div className="bg-teal text-white min-vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute requiredRole="merchant" />}>
            <Route path="/merchant/dashboard" element={<Merchant />} />
          </Route>
          
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<Admin />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:id" element={<DealDetails />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </AuthProvider>
  );
}

export default App;
