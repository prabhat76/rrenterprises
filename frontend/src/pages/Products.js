import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', hsn_code: '' });
  const [editing, setEditing] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`/api/products/${editing.id}`, form);
        setEditing(null);
      } else {
        await axios.post('/api/products', form);
      }
      setForm({ name: '', description: '', price: '', hsn_code: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleUploadPhoto = async (productId) => {
    if (!photoFile) return;
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      await axios.post(`/api/products/${productId}/photo`, formData);
      setPhotoFile(null);
      fetchProducts();
    } catch (err) {
      console.error('Error uploading photo:', err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditing(product);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="HSN Code" value={form.hsn_code} onChange={(e) => setForm({ ...form, hsn_code: e.target.value })} className="p-2 border rounded" />
        </div>
        <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', hsn_code: '' }); }} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">HSN Code</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">₹{parseFloat(p.price || 0).toFixed(2)}</td>
                <td className="p-2">{p.hsn_code}</td>
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

export default Products;