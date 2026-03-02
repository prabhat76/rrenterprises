import React, { useState, useEffect, useCallback } from 'react';
import api from '../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchReport = useCallback(async () => {
    try {
      const params = { startDate, endDate };
      let response;
      if (reportType === 'sales') {
        response = await api.get('/api/reports/sales', { params });
      } else if (reportType === 'payments') {
        response = await api.get('/api/reports/payments', { params });
      } else if (reportType === 'purchases') {
        response = await api.get('/api/reports/purchases', { params });
      }
      setData(response.data.invoices || response.data.transactions || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  }, [reportType, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate, fetchReport]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Reports & Analytics</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="p-2 border rounded">
            <option value="sales">Sales Report</option>
            <option value="payments">Payment Report</option>
            <option value="purchases">Purchase Report</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
          <button onClick={fetchReport} className="bg-blue-600 text-white px-4 py-2 rounded">Generate</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Total: ₹{total.toFixed(2)}</h3>
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <BarChart width={500} height={300} data={data.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="invoice_number" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_amount" fill="#8884d8" />
              </BarChart>
            </div>
            <div>
              <PieChart width={500} height={300}>
                <Pie data={data.slice(0, 5)} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ₹${value}`} outerRadius={80} fill="#8884d8" dataKey="total_amount">
                  {data.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Invoice #</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{row.invoice_number || row.id}</td>
                <td className="p-2">{row.invoice_date || row.transaction_date || row.purchase_date}</td>
                <td className="p-2">₹{parseFloat(row.total_amount || row.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;