import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';
import Merchant from './pages/merchant/Merchant';
import Admin from './pages/admin/Admin';
import Deals from './pages/user/Deals';
import Categories from './pages/user/Categories';
import './App.css';

function App() {
  return (
    <div className="bg-teal text-white min-vh-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </div>
  );
}

export default App;
