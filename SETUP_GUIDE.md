# RR Enterprises Billing Application - Complete Setup Guide

## Overview

This is a full-stack billing and inventory management system for RR Enterprises with the following capabilities:

- Complete invoice management with GST support
- Customer and product management  
- Purchase invoice tracking
- Inventory batch management
- Payment tracking
- Comprehensive reports and analytics
- PDF invoice generation
- User authentication

## System Requirements

- Node.js 14+ and npm
- PostgreSQL 12+
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### Step 1: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your database credentials:
```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_USER=your_postgres_user
DB_PASS=your_postgres_password
DB_NAME=roushan
JWT_SECRET=your_very_secret_jwt_key_12345
```

5. Create PostgreSQL database:
```bash
createdb roushan
```

6. Import schema (optional, Sequelize will auto-create):
```bash
psql -U your_user -d roushan -f ../schema.sql
```

7. Start backend server:
```bash
npm start
```

You should see:
```
Server running on port 4000
Database connected
```

### Step 2: Frontend Setup

1. In a new terminal, navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend development server:
```bash
npm start
```

Frontend opens automatically at `http://localhost:3000`

## First Use

### Create Admin User

1. On the login page, click "Need an account? Register"
2. Fill in:
   - Username: `admin`
   - Email: `admin@rr-enterprises.com`
   - Password: `your_secure_password`
3. Click Register
4. Login with credentials

### Add Sample Data

1. **Add Customers**:
   - Go to Customers page
   - Add customer details with GSTIN

2. **Add Products**:
   - Go to Products page
   - Add products with HSN codes and prices
   - Optionally upload product photos

3. **Create Invoice**:
   - Go to Invoices
   - Click "Create Invoice"
   - Select customer and products
   - Define GST
   - Save and view invoice
   - Export to PDF

4. **Track Payments**:
   - View invoice details
   - Record payment
   - See payment history

5. **Manage Inventory**:
   - Record purchase invoices
   - Inventory batches auto-update
   - Track expiry dates

## Features Guide

### 1. Invoice Management
- Create sales invoices with line items
- Support for CGST, SGST, IGST
- Automatic calculation of taxes
- Draft/Sent/Paid status tracking
- Export to PDF
- Payment tracking

### 2. Customer Management
- Maintain customer database
- Store GSTIN for GST compliance
- Contact information
- Full CRUD operations

### 3. Product Management
- Product catalog with HSN codes
- Price management
- Product photos/images
- Reusable product database

### 4. Purchase Invoices
- Record supplier purchases
- GST on purchases
- Automatic inventory updates
- Supplier tracking

### 5. Inventory Batches
- Batch-wise tracking
- Expiry date management
- Quantity tracking
- Automatic updates from purchases

### 6. Reports & Analytics
- Sales reports by date range
- Payment reports
- Purchase reports
- Visual charts (Bar, Pie)
- Exportable data

### 7. User Management
- Secure login/registration
- JWT token authentication
- Password hashing with bcrypt

## API Endpoints Summary

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login

CUSTOMERS
  GET    /api/customers
  POST   /api/customers
  GET    /api/customers/:id
  PUT    /api/customers/:id
  DELETE /api/customers/:id

PRODUCTS
  GET    /api/products
  POST   /api/products
  GET    /api/products/:id
  PUT    /api/products/:id
  DELETE /api/products/:id
  POST   /api/products/:id/photo

INVOICES
  GET    /api/invoices
  POST   /api/invoices
  GET    /api/invoices/:id
  PUT    /api/invoices/:id
  DELETE /api/invoices/:id
  POST   /api/invoices/:id/payment

INVENTORY
  GET    /api/inventory
  GET    /api/inventory/product/:productId
  POST   /api/inventory
  PUT    /api/inventory/:id
  DELETE /api/inventory/:id

REPORTS
  GET    /api/reports/sales?startDate&endDate
  GET    /api/reports/payments?startDate&endDate
  GET    /api/reports/purchases?startDate&endDate
```

## Database Tables

- `users` - User accounts
- `customers` - Customer information
- `products` - Product catalog
- `services` - Services (optional)
- `invoices` - Sales invoices
- `invoice_items` - Invoice line items
- `transactions` - Payment records
- `purchase_invoices` - Supplier invoices
- `purchase_items` - Purchase line items
- `inventory_batches` - Batch tracking
- `product_photos` - Product images

## File Structure

```
roushan/
├── backend/
│   ├── models/           # Sequelize models
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── config/           # Database config
│   ├── utils/            # Utilities
│   ├── app.js           # Express app
│   ├── package.json     # Dependencies
│   └── .env             # Environment vars
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── App.js       # Main app
│   │   └── index.js     # Entry point
│   ├── public/          # Static files
│   └── package.json
├── schema.sql           # Database schema
├── setup-db.js          # DB setup script
└── README.md            # Documentation
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify .env has correct DB credentials
- Check port 4000 is available

### Frontend won't connect to backend
- Ensure backend is running on 4000
- Check CORS - backend should allow requests
- Browser console should show actual error

### Database errors
- Recreate database: `dropdb roushan && createdb roushan`
- Drop/recreate PostgreSQL if needed
- Check DB credentials in .env

### Port already in use
- Backend: Change PORT in .env
- Frontend: Set PORT=3001 before npm start

## Performance Tips

1. Index frequent queries in database
2. Add pagination to list endpoints
3. Cache frequently accessed data
4. Compress images before upload
5. Use CDN for static files in production

## Security Considerations

1. Use strong JWT_SECRET
2. Hash passwords (already using bcrypt)
3. Validate all inputs server-side
4. Use HTTPS in production
5. Implement rate limiting
6. Restrict file upload types
7. Use environment variables for secrets

## Deployment

### Prepare for Production

1. Update .env to production values
2. Set `NODE_ENV=production`
3. Build frontend: `cd frontend && npm run build`
4. Use process manager (PM2) for backend
5. Set up reverse proxy (nginx)
6. Enable HTTPS with SSL certificate
7. Set up database backups

## Next Steps

1. Test all features thoroughly
2. Add more sample data
3. Customize branding (logo, colors)
4. Set up email notifications
5. Implement user roles and permissions
6. Add more reports
7. Set up automated backups

## Support

For issues:
1. Check error messages in browser console
2. Check backend server logs
3. Verify database connection
4. Review API responses in Network tab
5. Check error logs

## Contact

For questions or issues with the billing system, contact the development team.