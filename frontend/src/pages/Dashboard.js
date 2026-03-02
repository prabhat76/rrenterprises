import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, pendingInvoices: 0, paidInvoices: 0, totalProducts: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const invoices = await api.get('/api/invoices');
      const products = await api.get('/api/products');
      const totalRevenue = invoices.data.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
      const pending = invoices.data.filter(inv => inv.status !== 'done').length;
      const paid = invoices.data.filter(inv => inv.status === 'done').length;
      setStats({ totalRevenue, pendingInvoices: pending, paidInvoices: paid, totalProducts: products.data.length });
      setChartData([{ name: 'Invoices', paid, pending }]);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-gray-600">Pending Invoices</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-gray-600">Paid Invoices</h3>
          <p className="text-3xl font-bold text-green-600">{stats.paidInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-gray-600">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Invoice Overview</h3>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="paid" fill="#82ca9d" />
          <Bar dataKey="pending" fill="#ffc658" />
        </BarChart>
      </div>
    </div>
  );
};

export default Dashboard;