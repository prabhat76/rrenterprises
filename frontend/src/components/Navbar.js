import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold">RR Enterprises</h1>
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">Dashboard</Link>
            <Link to="/customers" className="hover:bg-gray-700 px-3 py-2 rounded">Customers</Link>
            <Link to="/products" className="hover:bg-gray-700 px-3 py-2 rounded">Products</Link>
            <Link to="/invoices" className="hover:bg-gray-700 px-3 py-2 rounded">Invoices</Link>
            <Link to="/purchases" className="hover:bg-gray-700 px-3 py-2 rounded">Purchases</Link>
            <Link to="/inventory" className="hover:bg-gray-700 px-3 py-2 rounded">Inventory</Link>
            <Link to="/reports" className="hover:bg-gray-700 px-3 py-2 rounded">Reports</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;