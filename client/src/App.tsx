import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Merchant from './pages/Merchant';
import Admin from './pages/Admin';
import Deals from './pages/Deals';
import Categories from './pages/Categories';
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
