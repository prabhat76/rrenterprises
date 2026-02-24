import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ product_id: '', batch_number: '', quantity: '', expiry_date: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setBatches(response.data);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`/api/inventory/${editing.id}`, form);
        setEditing(null);
      } else {
        await axios.post('/api/inventory', form);
      }
      setForm({ product_id: '', batch_number: '', quantity: '', expiry_date: '' });
      fetchBatches();
    } catch (err) {
      console.error('Error saving batch:', err);
    }
  };

  const handleEdit = (batch) => {
    setForm(batch);
    setEditing(batch);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/inventory/${id}`);
      fetchBatches();
    } catch (err) {
      console.error('Error deleting batch:', err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Inventory Batches</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Batch' : 'Add Batch'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" placeholder="Product ID" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Batch Number" value={form.batch_number} onChange={(e) => setForm({ ...form, batch_number: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="p-2 border rounded" />
          <input type="date" placeholder="Expiry Date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="p-2 border rounded" />
        </div>
        <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && <button onClick={() => { setEditing(null); setForm({ product_id: '', batch_number: '', quantity: '', expiry_date: '' }); }} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Batch #</th>
              <th className="p-2 text-left">Product ID</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Expiry Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.id} className="border-b">
                <td className="p-2">{b.batch_number}</td>
                <td className="p-2">{b.productId}</td>
                <td className="p-2">{b.quantity}</td>
                <td className="p-2">{b.expiry_date || 'N/A'}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(b)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;