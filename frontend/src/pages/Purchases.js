import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ invoice_number: '', supplier_name: '', purchase_date: '', total_amount: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/api/purchases');
      setPurchases(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setPurchases([]);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`/api/purchases/${editing.id}`, form);
        setEditing(null);
      } else {
        await axios.post('/api/purchases', form);
      }
      setForm({ invoice_number: '', supplier_name: '', purchase_date: '', total_amount: '' });
      fetchPurchases();
    } catch (err) {
      console.error('Error saving purchase:', err);
    }
  };

  const handleEdit = (purchase) => {
    setForm(purchase);
    setEditing(purchase);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/purchases/${id}`);
      fetchPurchases();
    } catch (err) {
      console.error('Error deleting purchase:', err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Purchase Invoices</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Purchase' : 'Add Purchase Invoice'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Invoice Number" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Supplier Name" value={form.supplier_name} onChange={(e) => setForm({ ...form, supplier_name: e.target.value })} className="p-2 border rounded" />
          <input type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Total Amount" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} className="p-2 border rounded" />
        </div>
        <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && <button onClick={() => { setEditing(null); setForm({ invoice_number: '', supplier_name: '', purchase_date: '', total_amount: '' }); }} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Invoice #</th>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.invoice_number}</td>
                <td className="p-2">{p.supplier_name}</td>
                <td className="p-2">{p.purchase_date}</td>
                <td className="p-2">₹{parseFloat(p.total_amount || 0).toFixed(2)}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;