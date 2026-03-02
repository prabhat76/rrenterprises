require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : null;
const corsOptions = {
  origin: frontendUrl || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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

// health check (no database required)
app.get('/', (req, res) => res.json({ status: 'ok', message: 'RR Enterprises API' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date() }));

// Database connection for serverless (Vercel) vs traditional server
let isDbConnected = false;

async function connectDatabase() {
  if (!isDbConnected) {
    try {
      console.log('Attempting to authenticate with database...');
      await sequelize.authenticate();
      console.log('Database connected');
      await sequelize.sync();
      isDbConnected = true;
    } catch (err) {
      console.error('Unable to connect to database:', err.message);
      throw err;
    }
  }
}

// Middleware to ensure DB connection for serverless (lazy loading)
app.use(async (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/' || req.path === '/health' || req.path === '/api/test') {
    return next();
  }
  
  try {
    if (process.env.NODE_ENV === 'production') {
      await connectDatabase();
    }
    next();
  } catch (err) {
    console.error('DB middleware error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// For local development
if (require.main === module) {
  (async () => {
    try {
      await connectDatabase();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error('Startup error:', err);
      process.exit(1);
    }
  })();
}

// Export for Vercel serverless
module.exports = app;