
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// In-memory data
const initialClients = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St, Anytown, USA' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', address: '456 Oak Ave, Othertown, USA' },
];

const initialInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-001',
    date: '2026-02-20',
    dueDate: '2026-03-20',
    client: 1,
    items: [
      { description: 'Web Design', quantity: 1, unitPrice: 1500 },
      { description: 'Hosting (1 year)', quantity: 1, unitPrice: 300 },
    ],
    tax: 8,
    discount: 5,
    status: 'Paid',
    payments: [{ date: '2026-02-21', amount: 1728.8, method: 'Credit Card' }]
  },
  {
    id: 2,
    invoiceNumber: 'INV-002',
    date: '2026-02-15',
    dueDate: '2026-03-15',
    client: 2,
    items: [
      { description: 'Logo Design', quantity: 1, unitPrice: 500 },
      { description: 'Business Cards', quantity: 200, unitPrice: 0.5 },
    ],
    tax: 8,
    discount: 0,
    status: 'Unpaid',
    payments: []
  },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [clients, setClients] = useState(initialClients);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const navigateTo = (page) => {
    setSelectedInvoice(null);
    setShowInvoiceForm(false);
    setCurrentPage(page);
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = () => {
      setShowInvoiceForm(true);
  }

  const handleSaveInvoice = (invoiceToSave) => {
    if (invoiceToSave.id) {
        setInvoices(invoices.map(inv => (inv.id === invoiceToSave.id ? invoiceToSave : inv)));
    } else {
        const newInvoiceWithId = { ...invoiceToSave, id: Date.now(), invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}` };
        setInvoices([...invoices, newInvoiceWithId]);
    }
    setShowInvoiceForm(false);
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
        setInvoices(invoices.filter(inv => inv.id !== invoiceId));
        setSelectedInvoice(null);
    }
  }

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceForm(false);
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header onNavigate={navigateTo} />
      <main className="p-8">
        {currentPage === 'dashboard' && <Dashboard invoices={invoices} />}
        {currentPage === 'invoices' && !selectedInvoice && !showInvoiceForm && 
            <InvoiceList invoices={invoices} clients={clients} onSelectInvoice={handleSelectInvoice} onCreateInvoice={handleCreateInvoice} />}
        {currentPage === 'invoices' && selectedInvoice && !showInvoiceForm &&
            <InvoiceDetails invoice={selectedInvoice} clients={clients} onBack={() => setSelectedInvoice(null)} onEdit={handleEditInvoice} onDelete={() => handleDeleteInvoice(selectedInvoice.id)} />}
        {currentPage === 'invoices' && showInvoiceForm && 
            <InvoiceForm clients={clients} onSave={handleSaveInvoice} onCancel={() => setShowInvoiceForm(false)} invoice={selectedInvoice} />}
        {currentPage === 'clients' && <ClientManagement clients={clients} setClients={setClients} invoices={invoices} setInvoices={setInvoices} />}
      </main>
    </div>
  );
};

const Header = ({ onNavigate }) => (
  <header className="bg-gray-800 text-white shadow-md">
    <div className="container mx-auto px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gold-400">RR Enterprise</h1>
      <nav>
        <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 rounded hover:bg-gray-700">Dashboard</button>
        <button onClick={() => onNavigate('invoices')} className="px-4 py-2 rounded hover:bg-gray-700">Invoices</button>
        <button onClick={() => onNavigate('clients')} className="px-4 py-2 rounded hover:bg-gray-700">Clients</button>
      </nav>
    </div>
  </header>
);

const Dashboard = ({ invoices }) => {
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, inv) => {
      const subtotal = inv.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const taxAmount = (subtotal * inv.tax) / 100;
      const discountAmount = (subtotal * inv.discount) / 100;
      return acc + subtotal + taxAmount - discountAmount;
    }, 0);

  const pendingInvoices = invoices.filter(inv => inv.status === 'Unpaid').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const recentActivity = invoices.slice(0, 5).map(inv => `Invoice ${inv.invoiceNumber} was created.`);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-navy-900">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-navy-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Pending Invoices</h3>
          <p className="text-3xl font-bold text-navy-900">{pendingInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Paid Invoices</h3>
          <p className="text-3xl font-bold text-navy-900">{paidInvoices}</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Recent Activity</h3>
        <ul>
          {recentActivity.map((activity, index) => (
            <li key={index} className="border-b py-2 text-gray-700">{activity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const InvoiceList = ({ invoices, clients, onSelectInvoice, onCreateInvoice }) => {
    const [filter, setFilter] = useState({ status: '', client: '', startDate: '', endDate: '' });

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };
    
    const filteredInvoices = invoices.filter(invoice => {
        const client = clients.find(c => c.id === invoice.client);
        const invoiceDate = new Date(invoice.date);

        const statusMatch = filter.status ? invoice.status === filter.status : true;
        const clientMatch = filter.client ? client.name.toLowerCase().includes(filter.client.toLowerCase()) : true;
        const startDateMatch = filter.startDate ? invoiceDate >= new Date(filter.startDate) : true;
        const endDateMatch = filter.endDate ? invoiceDate <= new Date(filter.endDate) : true;
        
        return statusMatch && clientMatch && startDateMatch && endDateMatch;
    });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-navy-900">Invoices</h2>
            <button onClick={onCreateInvoice} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md transform hover:scale-105 transition-transform">Create Invoice</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input type="text" name="client" placeholder="Filter by client..." value={filter.client} onChange={handleFilterChange} className="p-2 border rounded"/>
            <select name="status" value={filter.status} onChange={handleFilterChange} className="p-2 border rounded">
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partially Paid">Partially Paid</option>
            </select>
            <input type="date" name="startDate" value={filter.startDate} onChange={handleFilterChange} className="p-2 border rounded"/>
            <input type="date" name="endDate" value={filter.endDate} onChange={handleFilterChange} className="p-2 border rounded"/>
        </div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Invoice #</th>
            <th className="py-2 px-4">Client</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Due Date</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map(invoice => {
            const client = clients.find(c => c.id === invoice.client);
            const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
            const total = subtotal + (subtotal * invoice.tax / 100) - (subtotal * invoice.discount / 100);
            return (
              <tr key={invoice.id} className="border-b">
                <td className="py-2 px-4">{invoice.invoiceNumber}</td>
                <td className="py-2 px-4">{client ? client.name : 'N/A'}</td>
                <td className="py-2 px-4">{invoice.date}</td>
                <td className="py-2 px-4">{invoice.dueDate}</td>
                <td className="py-2 px-4">${total.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === 'Paid' ? 'bg-green-200 text-green-800' :
                    invoice.status === 'Unpaid' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button onClick={() => onSelectInvoice(invoice)} className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const InvoiceDetails = ({ invoice, clients, onBack, onEdit, onDelete }) => {
    const invoiceRef = useRef();
  const client = clients.find(c => c.id === invoice.client);

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * invoice.tax / 100;
  const discountAmount = subtotal * invoice.discount / 100;
  const grandTotal = subtotal + taxAmount - discountAmount;

  const handleExportPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">&larr; Back to Invoices</button>
      <div ref={invoiceRef} className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-navy-900">RR Enterprise</h1>
            <p className="text-gray-500">123 Business Rd, Suite 100, Biz Town, USA</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-700">INVOICE</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Bill To:</h3>
            <p>{client ? client.name : ''}</p>
            <p>{client ? client.address : ''}</p>
            <p>{client ? client.email : ''}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Invoice Number:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-bold">Invoice Date:</span> {invoice.date}</p>
            <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
          </div>
        </div>
        <table className="min-w-full mb-8">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Quantity</th>
              <th className="py-2 px-4 text-right">Unit Price</th>
              <th className="py-2 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{item.description}</td>
                <td className="py-2 px-4 text-right">{item.quantity}</td>
                <td className="py-2 px-4 text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="py-2 px-4 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mb-8">
          <div className="w-1/3">
            <div className="flex justify-between">
              <span className="font-bold">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Tax ({invoice.tax}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Discount ({invoice.discount}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t-2 border-gray-800">
              <span className="font-bold text-xl">Grand Total:</span>
              <span className="font-bold text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div>
            <h3 className="font-bold text-gray-800 mb-2">Payment History</h3>
            {invoice.payments.length > 0 ? (
                <ul>
                    {invoice.payments.map((p, i) => <li key={i}>{p.date}: ${p.amount} ({p.method})</li>)}
                </ul>
            ) : <p>No payments yet.</p>}
        </div>
      </div>
      <button onClick={handleExportPDF} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md transform hover:scale-105 transition-transform">Export to PDF</button>
      <button onClick={onEdit} className="mt-4 ml-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 shadow-md transform hover:scale-105 transition-transform">Edit</button>
      <button onClick={onDelete} className="mt-4 ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow-md transform hover:scale-105 transition-transform">Delete</button>
    </div>
  );
};

const InvoiceForm = ({ clients, onSave, onCancel, invoice: invoiceToEdit }) => {
    const [invoice, setInvoice] = useState({
        client: clients[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        tax: 8,
        discount: 0,
        status: 'Unpaid',
        payments: []
    });

    React.useEffect(() => {
        if (invoiceToEdit) {
            setInvoice(invoiceToEdit);
        }
    }, [invoiceToEdit]);

    const handleChange = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...invoice.items];
        newItems[index][field] = value;
        setInvoice({ ...invoice, items: newItems });
    };

    const handleAddItem = () => {
        setInvoice({ ...invoice, items: [...invoice.items, { description: '', quantity: 1, unitPrice: 0 }] });
    };

    const handleRemoveItem = (index) => {
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: newItems });
    };

    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);
    const taxAmount = subtotal * invoice.tax / 100;
    const discountAmount = subtotal * invoice.discount / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-navy-900">{invoiceToEdit ? 'Edit Invoice' : 'Create Invoice'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="mb-2">
                    <label className="block mb-1">Client</label>
                    <select name="client" value={invoice.client} onChange={handleChange} className="p-2 border rounded w-full">
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block mb-1">Date</label>
                    <input type="date" name="date" value={invoice.date} onChange={handleChange} className="p-2 border rounded w-full"/>
                </div>
                <div className="mb-2">
                    <label className="block mb-1">Due Date</label>
                    <input type="date" name="dueDate" value={invoice.dueDate} onChange={handleChange} className="p-2 border rounded w-full"/>
                </div>
            </div>
            
            <h3 className="text-lg font-bold mt-6 mb-2">Items</h3>
            {invoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mb-2 items-center">
                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="p-2 border rounded col-span-2"/>
                    <input type="number" placeholder="Quantity" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="p-2 border rounded"/>
                    <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="p-2 border rounded"/>
                    <button onClick={() => handleRemoveItem(index)} className="text-red-500">Remove</button>
                </div>
            ))}
            <button onClick={handleAddItem} className="text-blue-600 mb-4">+ Add Item</button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="mb-2">
                    <label className="block mb-1">Tax (%)</label>
                    <input type="number" name="tax" value={invoice.tax} onChange={handleChange} className="p-2 border rounded w-full"/>
                </div>
                <div className="mb-2">
                    <label className="block mb-1">Discount (%)</label>
                    <input type="number" name="discount" value={invoice.discount} onChange={handleChange} className="p-2 border rounded w-full"/>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <div className="w-1/3">
                    <div className="flex justify-between">
                        <span className="font-bold">Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold">Tax ({invoice.tax}%):</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold">Discount ({invoice.discount}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t-2 border-gray-800">
                        <span className="font-bold text-xl">Grand Total:</span>
                        <span className="font-bold text-xl">${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end mt.6">
                <button onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 shadow-md transform hover:scale-105 transition-transform">Cancel</button>
                <button onClick={() => onSave(invoice)} className="bg-blue-600 text-white px-4 py-2 rounded shadow-md transform hover:scale-105 transition-transform">Save Invoice</button>
            </div>
        </div>
    );
};


const ClientManagement = ({ clients, setClients, invoices, setInvoices }) => {
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '' });
    const [editingClient, setEditingClient] = useState(null);

    const handleSaveClient = () => {
        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id ? newClient : c));
            setEditingClient(null);
        } else {
            setClients([...clients, { ...newClient, id: Date.now() }]);
        }
        setNewClient({ name: '', email: '', phone: '', address: '' });
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setNewClient(client);
    }

    const handleDeleteClient = (clientId) => {
        if (window.confirm('Are you sure you want to delete this client? This will also delete all of their invoices.')) {
            setClients(clients.filter(c => c.id !== clientId));
            setInvoices(invoices.filter(inv => inv.client !== clientId));
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-navy-900">Client Management</h2>
            <div className="flex flex-wrap items-center mb-4">
                <input type="text" placeholder="Name" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className="p-2 border rounded mr-2 mb-2"/>
                <input type="email" placeholder="Email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} className="p-2 border rounded mr-2 mb-2"/>
                <input type="text" placeholder="Phone" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} className="p-2 border rounded mr-2 mb-2"/>
                <input type="text" placeholder="Address" value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} className="p-2 border rounded mr-2 mb-2"/>
                <button onClick={handleSaveClient} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md transform hover:scale-105 transition-transform">{editingClient ? 'Save Client' : 'Add Client'}</button>
                {editingClient && <button onClick={() => { setEditingClient(null); setNewClient({ name: '', email: '', phone: '', address: '' });}} className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded shadow-md transform hover:scale-105 transition-transform">Cancel</button>}
            </div>
            <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Phone</th>
                        <th className="py-2 px-4">Address</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id} className="border-b">
                            <td className="py-2 px-4">{client.name}</td>
                            <td className="py-2 px-4">{client.email}</td>
                            <td className="py-2 px-4">{client.phone}</td>
                            <td className="py-2 px-4">{client.address}</td>
                            <td className="py-2 px-4">
                                <button onClick={() => handleEditClient(client)} className="text-yellow-500 hover:underline">Edit</button>
                                <button onClick={() => handleDeleteClient(client.id)} className="text-red-500 hover:underline ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
