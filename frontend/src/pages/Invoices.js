import React, { useState, useEffect, useRef } from 'react';
import api from '../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [form, setForm] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft'
  });

  const [lineItem, setLineItem] = useState({
    product_id: '',
    quantity: '',
    unit_price: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    notes: ''
  });

  const invoiceRef = useRef();

  useEffect(() => {
    fetchInvoices();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/api/invoices');
      setInvoices(response.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const response = await api.post('/api/invoices', form);
      setForm({ customer_id: '', invoice_date: new Date().toISOString().split('T')[0], due_date: '', status: 'draft' });
      setCurrentView('edit');
      setSelectedInvoice(response.data);
      fetchInvoices();
    } catch (err) {
      console.error('Error creating invoice:', err);
    }
  };

  const handleAddLineItem = async () => {
    try {
      if (!lineItem.product_id || !lineItem.quantity || !lineItem.unit_price) {
        alert('Please fill all fields');
        return;
      }

      await api.post(
        `/api/invoices/${selectedInvoice.id}/items`,
        {
          product_id: parseInt(lineItem.product_id),
          quantity: parseInt(lineItem.quantity),
          unit_price: parseFloat(lineItem.unit_price)
        }
      );

      // Refresh invoice details
      const invResponse = await api.get(`/api/invoices/${selectedInvoice.id}/detail`);
      setSelectedInvoice(invResponse.data);
      setLineItem({ product_id: '', quantity: '', unit_price: '' });
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding line item');
      console.error('Error:', err);
    }
  };

  const handleDeleteLineItem = async (itemId) => {
    if (!window.confirm('Delete this line item?')) return;
    try {
      await api.delete(`/api/invoices/items/${itemId}`);
      const invResponse = await api.get(`/api/invoices/${selectedInvoice.id}/detail`);
      setSelectedInvoice(invResponse.data);
      fetchInvoices();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleRecordPayment = async () => {
    try {
      if (!paymentForm.amount) {
        alert('Please enter amount');
        return;
      }

      await api.post(`/api/invoices/${selectedInvoice.id}/payment`, paymentForm);
      setPaymentForm({
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        notes: ''
      });

      // Refresh invoice
      const invResponse = await api.get(`/api/invoices/${selectedInvoice.id}/detail`);
      setSelectedInvoice(invResponse.data);
      fetchInvoices();
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.error || 'Error recording payment');
    }
  };

  const handleExportPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${selectedInvoice.invoice_number}.pdf`);
  };

  const getProductName = (id) => {
    const prod = products.find(p => p.id === id);
    return prod ? prod.name : `Product #${id}`;
  };

  const getCustomerName = (id) => {
    const cust = customers.find(c => c.id === id);
    return cust ? cust.name : `Customer #${id}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Invoices</h2>

      {/* LIST VIEW */}
      {currentView === 'list' && (
        <div>
          <button
            onClick={() => {
              setCurrentView('create');
              setSelectedInvoice(null);
            }}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Invoice
          </button>

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-left">Invoice #</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Balance</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(i => (
                  <tr key={i.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{i.invoice_number}</td>
                    <td className="p-3">{getCustomerName(i.customer_id)}</td>
                    <td className="p-3">{i.invoice_date}</td>
                    <td className="p-3 text-right">₹{parseFloat(i.total_amount || 0).toFixed(2)}</td>
                    <td className="p-3 text-right text-green-600">
                      ₹{i.paymentHistory ? i.paymentHistory.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0).toFixed(2) : '0.00'}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      ₹{(parseFloat(i.total_amount || 0) - (i.paymentHistory ? i.paymentHistory.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) : 0)).toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-white text-xs font-bold ${
                        i.status === 'paid' ? 'bg-green-600' :
                        i.status === 'partial' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(i);
                          setCurrentView('view');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE VIEW */}
      {currentView === 'create' && !selectedInvoice && (
        <div className="bg-white p-6 rounded shadow max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Create New Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Customer *</label>
              <select
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Invoice Date</label>
              <input
                type="date"
                value={form.invoice_date}
                onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-6 space-x-2">
            <button
              onClick={handleCreateInvoice}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
            >
              Create & Add Items
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT VIEW - Add Line Items */}
      {currentView === 'edit' && selectedInvoice && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Invoice #{selectedInvoice.invoice_number}</h3>
            <p className="text-sm text-gray-600">Customer: {getCustomerName(selectedInvoice.customer_id)}</p>

            {/* Add Line Item Form */}
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-4">Add Product to Invoice</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Product *</label>
                  <select
                    value={lineItem.product_id}
                    onChange={(e) => {
                      const prod = products.find(p => p.id === parseInt(e.target.value));
                      setLineItem({
                        ...lineItem,
                        product_id: e.target.value,
                        unit_price: prod?.price || ''
                      });
                    }}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Qty *</label>
                  <input
                    type="number"
                    min="1"
                    value={lineItem.quantity}
                    onChange={(e) => setLineItem({ ...lineItem, quantity: e.target.value })}
                    placeholder="Qty"
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Unit Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={lineItem.unit_price}
                    onChange={(e) => setLineItem({ ...lineItem, unit_price: e.target.value })}
                    placeholder="₹"
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddLineItem}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 font-semibold text-sm"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            {selectedInvoice.InvoiceItems && selectedInvoice.InvoiceItems.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.InvoiceItems.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{getProductName(item.item_id)}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">₹{parseFloat(item.unit_price).toFixed(2)}</td>
                        <td className="p-2 text-right font-semibold">₹{parseFloat(item.total_price).toFixed(2)}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteLineItem(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals */}
            <div className="mt-6 border-t pt-4">
              <div className="text-right space-y-2">
                <div className="flex justify-end gap-4">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="text-lg">₹{selectedInvoice.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="font-semibold">Paid:</span>
                  <span className="text-green-600 text-lg">₹{selectedInvoice.paidAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-end gap-4 bg-yellow-100 p-2 rounded">
                  <span className="font-bold">Balance Due:</span>
                  <span className="text-red-600 text-lg font-bold">₹{selectedInvoice.balanceDue?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-x-2">
              <button
                onClick={() => {
                  setSelectedInvoice(null);
                  setCurrentView('view');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
              >
                View / Print Invoice
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW/PRINT VIEW */}
      {currentView === 'view' && selectedInvoice && (
        <div className="space-y-6">
          {/* Invoice Display */}
          <div ref={invoiceRef} className="bg-white p-8 rounded shadow border-2 border-gray-200">
            {/* Header */}
            <div className="grid grid-cols-3 mb-8 pb-8 border-b-2">
              <div>
                <h1 className="text-3xl font-bold">RR Enterprises</h1>
                <p className="text-sm text-gray-600 mt-2">Electronics & Home Appliances</p>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">INVOICE</h2>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">#{selectedInvoice.invoice_number}</p>
                <p className="text-sm">Date: {selectedInvoice.invoice_date}</p>
                <p className="text-sm">Due: {selectedInvoice.due_date}</p>
              </div>
            </div>

            {/* Customer & Details */}
            <div className="grid grid-cols-2 mb-8 gap-8">
              <div>
                <h3 className="font-bold text-sm mb-2">BILL TO:</h3>
                <p className="font-semibold">{selectedInvoice.Customer?.name || 'Customer'}</p>
                <p className="text-sm">{selectedInvoice.Customer?.email}</p>
                <p className="text-sm">{selectedInvoice.Customer?.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm"><strong>Status:</strong> {selectedInvoice.status}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-8 border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-3 text-left">PRODUCT</th>
                  <th className="border p-3 text-center">QTY</th>
                  <th className="border p-3 text-right">RATE</th>
                  <th className="border p-3 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.InvoiceItems && selectedInvoice.InvoiceItems.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="border p-3">{getProductName(item.item_id)}</td>
                    <td className="border p-3 text-center">{item.quantity}</td>
                    <td className="border p-3 text-right">₹{parseFloat(item.unit_price).toFixed(2)}</td>
                    <td className="border p-3 text-right font-semibold">₹{parseFloat(item.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between mb-2 border-b pb-2">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoice.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between mb-2 border-b pb-2">
                  <span>Amount Paid:</span>
                  <span className="text-green-600">₹{selectedInvoice.paidAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-yellow-100 p-2 rounded">
                  <span>Balance Due:</span>
                  <span>₹{selectedInvoice.balanceDue?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 pt-4 text-xs text-gray-600">
              <p>Thank you for your business!</p>
              <p>Payment Terms: As discussed | Returns accepted within 7 days with original receipt</p>
            </div>
          </div>

          {/* Payment Recording Section */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Record Payment</h3>
            {selectedInvoice.paymentHistory && selectedInvoice.paymentHistory.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-3">Payment History:</h4>
                <div className="space-y-2 text-sm">
                  {selectedInvoice.paymentHistory.map((payment, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <span className="font-semibold">{payment.transaction_date}</span> - {payment.payment_method}
                      </div>
                      <span className="text-green-600">₹{parseFloat(payment.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedInvoice.balanceDue > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="₹"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={paymentForm.transaction_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_date: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleRecordPayment}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            )}
            {selectedInvoice.balanceDue <= 0 && (
              <div className="p-4 bg-green-100 border border-green-400 rounded text-green-800 font-semibold">
                ✓ Invoice Paid in Full
              </div>
            )}
          </div>

          {/* Export & Back Buttons */}
          <div className="bg-white p-6 rounded shadow space-x-2">
            <button
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold"
            >
              📄 Export to PDF
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
