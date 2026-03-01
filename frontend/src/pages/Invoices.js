import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    total_amount: '',
    status: 'draft'
  });
  const invoiceRef = useRef();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices');
      setInvoices(response.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/invoices', form);
      setForm({ customer_id: '', invoice_date: new Date().toISOString().split('T')[0], due_date: '', total_amount: '', status: 'draft' });
      setCurrentView('list');
      fetchInvoices();
    } catch (err) {
      console.error('Error creating invoice:', err);
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

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Invoices</h2>
      {currentView === 'list' && (
        <div>
          <button onClick={() => setCurrentView('create')} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">Create Invoice</button>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 text-left">Invoice #</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(i => (
                  <tr key={i.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{i.invoice_number}</td>
                    <td className="p-2">{i.invoice_date}</td>
                    <td className="p-2">₹{parseFloat(i.total_amount || 0).toFixed(2)}</td>
                    <td className="p-2"><span className="bg-blue-200 px-2 py-1 rounded text-sm">{i.status}</span></td>
                    <td className="p-2">
                      <button onClick={() => { setSelectedInvoice(i); setCurrentView('view'); }} className="text-blue-600">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {currentView === 'create' && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Create Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" placeholder="Customer ID" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} className="p-2 border rounded" />
            <input type="date" value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} className="p-2 border rounded" />
            <input type="date" placeholder="Due Date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="p-2 border rounded" />
            <input type="number" placeholder="Total Amount" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} className="p-2 border rounded" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="p-2 border rounded">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <button onClick={handleCreate} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Create</button>
          <button onClick={() => setCurrentView('list')} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      )}
      {currentView === 'view' && selectedInvoice && (
        <div className="bg-white p-6 rounded shadow">
          <button onClick={() => setCurrentView('list')} className="mb-4 text-blue-600">← Back</button>
          <div ref={invoiceRef} className="p-8 border">
            <h2 className="text-2xl font-bold mb-4">Invoice #{selectedInvoice.invoice_number}</h2>
            <p><strong>Date:</strong> {selectedInvoice.invoice_date}</p>
            <p><strong>Due Date:</strong> {selectedInvoice.due_date}</p>
            <p><strong>Total Amount:</strong> ₹{parseFloat(selectedInvoice.total_amount).toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedInvoice.status}</p>
          </div>
          <button onClick={handleExportPDF} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Export to PDF</button>
        </div>
      )}
    </div>
  );
};

export default Invoices;