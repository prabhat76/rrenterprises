require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const invoiceRoutes = require('./routes/invoices');
const purchaseRoutes = require('./routes/purchases');
const inventoryRoutes = require('./routes/inventory');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 4000;

// Debug: Log database config
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);

// health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// start server after db connection
(async () => {
  try {
    console.log('Attempting to authenticate with database...');
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync(); // maybe use migrations later
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to database:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
})();