import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
          await api.put(`/api/customers/${editing.id}`, form);
        setEditing(null);
      } else {
          await api.post('/api/customers', form);
      }
      setForm({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditing(customer);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Customers</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Customer' : 'Add Customer'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="p-2 border rounded" />
        </div>
        <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', address: '' }); }} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.address}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;