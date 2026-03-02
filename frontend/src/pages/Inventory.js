import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Inventory = () => {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ product_id: '', batch_number: '', quantity: '', expiry_date: '' });
  const [editing, setEditing] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [billFile, setBillFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await api.get('/api/inventory');
      setBatches(response.data);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/api/inventory/${editing.id}`, form);
        setEditing(null);
      } else {
        await api.post('/api/inventory', form);
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
      await api.delete(`/api/inventory/${id}`);
      fetchBatches();
    } catch (err) {
      console.error('Error deleting batch:', err);
    }
  };

  const handleBillUpload = async (e) => {
    e.preventDefault();
    if (!billFile || !selectedBatchId) {
      alert('Please select a file and batch');
      return;
    }

    const formData = new FormData();
    formData.append('bill', billFile);

    setUploading(true);
    try {
      await api.post(`/api/inventory/${selectedBatchId}/bill`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Bill uploaded successfully!');
      setBillFile(null);
      setSelectedBatchId(null);
      fetchBatches();
    } catch (err) {
      console.error('Error uploading bill:', err);
      alert('Failed to upload bill');
    } finally {
      setUploading(false);
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

      <div className="bg-yellow-50 p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">📄 Upload Bill / Invoice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)} className="p-2 border rounded">
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.batch_number} - Product {b.productId}
              </option>
            ))}
          </select>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setBillFile(e.target.files[0])} className="p-2 border rounded" />
          <button onClick={handleBillUpload} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-400">
            {uploading ? 'Uploading...' : 'Upload Bill'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Batch #</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Expiry Date</th>
              <th className="p-2 text-left">Bill</th>
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
                  {b.bill_image_path ? (
                    <a href={b.bill_image_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      View Bill
                    </a>
                  ) : (
                    <span className="text-gray-400">No bill</span>
                  )}
                </td>
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