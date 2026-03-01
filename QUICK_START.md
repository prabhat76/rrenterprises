# 🚀 QUICK START GUIDE - RR ENTERPRISES

## One-Command Setup (Local Testing)

### Prerequisites
```bash
# Install Node.js 14+ and PostgreSQL 12+
node --version    # Should be v14+
npm --version     # Should be v6+
psql --version    # Should be PostgreSQL 12+
```

### Step 1: Setup Database (PostgreSQL)
```bash
cd /Users/prabhatkumar/Desktop/roushan

# Create database and schema
createdb roushan
psql roushan < schema.sql

# Seed with 19 home appliances
cd backend
node seed-products.js

# Generate QR codes
node generate-qr-codes.js

# Go back
cd ..
```

### Step 2: Setup Backend
```bash
cd backend
npm install
cp .env.example .env

# Edit .env and add your database credentials:
# DB_HOST=127.0.0.1
# DB_USER=postgres
# DB_PASS=your_password
# DB_NAME=roushan

npm start
# Backend running on http://localhost:4000
```

### Step 3: Setup Frontend (New Terminal)
```bash
cd frontend
npm install
npm start
# Frontend running on http://localhost:3000
```

### Step 4: Access the App
- Go to: http://localhost:3000
- Register: Set username/password (username: `admin`, password: `admin`)
- Login with credentials

---

## Quick Testing Workflow

### 1️⃣ Add a Customer
- Navigate to **Customers**
- Click **Add Customer**
- Fill in:
  - Name: "Sharma Electronics"
  - Email: "sharma@email.com"
  - Phone: "9876543210"
  - Address: "123 Market St, Delhi"
- Click **Add**

### 2️⃣ View Products
- Navigate to **Products**
- Should see 19 home appliances pre-loaded
- Example: Refrigerator, Washing Machine, AC, etc.

### 3️⃣ Create an Invoice
- Navigate to **Invoices**
- Click **Create Invoice**
- Fill in:
  - Customer ID: `1` (the one we just created)
  - Invoice Date: Today
  - Due Date: 15 days from today
  - Total Amount: `50000`
  - Status: Draft
- Click **Create**

### 4️⃣ View Invoice
- Click **View** on created invoice
- See invoice details
- Click **Export to PDF** to download

### 5️⃣ Record Purchase
- Navigate to **Purchases**
- Click **Add Purchase Invoice**
- Fill in:
  - Invoice Number: `SUP-001`
  - Supplier Name: "ABC Electronics Ltd"
  - Purchase Date: Today
  - Total Amount: `100000`
- Click **Add**
- ✅ Inventory batches auto-created!

### 6️⃣ Check Inventory
- Navigate to **Inventory**
- See batches created from purchase
- Check quantities and expiry dates

### 7️⃣ View Reports
- Navigate to **Reports**
- Select report type: "Sales"
- Set date range
- See charts and analytics

### 8️⃣ Test QR Scanner
- Open: http://localhost:4000/qr-scanner.html
- Click camera icon
- Hold a printed QR code to camera
- See product details and quick add to inventory

---

## API Endpoints (For Testing with curl/Postman)

### Authentication
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin","email":"admin@test.com"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Customers
```bash
# Get all customers
curl http://localhost:4000/api/customers

# Create customer
curl -X POST http://localhost:4000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Shop","email":"shop@test.com","phone":"9999999999","address":"Test Address"}'
```

### Products
```bash
# Get all products
curl http://localhost:4000/api/products

# Create product
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"Test","price":500,"hsn_code":"12345"}'
```

### Invoices
```bash
# Get all invoices
curl http://localhost:4000/api/invoices

# Create invoice
curl -X POST http://localhost:4000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"invoice_date":"2026-03-01","total_amount":5000,"status":"draft"}'
```

### Inventory
```bash
# Get all inventory batches
curl http://localhost:4000/api/inventory
```

### Reports
```bash
# Get sales analytics
curl http://localhost:4000/api/reports/sales?startDate=2026-01-01&endDate=2026-03-31

# Get top sellers
curl http://localhost:4000/api/reports/top-sellers

# Get slow movers
curl http://localhost:4000/api/reports/slow-movers
```

---

## Database Commands (Direct Testing)

```bash
# Connect to database
psql roushan

# List all tables
\dt

# Check users
SELECT * FROM users;

# Check customers
SELECT * FROM customers;

# Check products (should have 19)
SELECT COUNT(*) FROM products;
SELECT name, price FROM products LIMIT 5;

# Check invoices
SELECT * FROM invoices;

# Check inventory batches
SELECT * FROM inventory_batches;

# Exit
\q
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill process using port 4000
kill -9 <PID>

# Or change PORT in .env
PORT=5000
```

### Frontend won't build
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Check credentials
psql -U postgres -d roushan

# Reset password if needed
psql -U postgres
ALTER USER postgres WITH PASSWORD 'newpassword';
```

### QR Scanner not working
- Must use HTTPS in production
- Works on localhost
- Grant camera permissions when prompted on mobile

---

## Useful Commands

```bash
# View logs for specific table
psql roushan
SELECT * FROM invoices WHERE invoice_date < NOW() - INTERVAL '1 day';

# Backup database
pg_dump roushan > backup.sql

# Restore database
psql roushan < backup.sql

# Count records
psql roushan -c "SELECT COUNT(*) FROM customers;"

# Clear all data (careful!)
psql roushan < schema.sql
```

---

## File Structure Reference

```
/backend
  ├── app.js                      # Main Express app
  ├── .env                        # Environment variables
  ├── package.json                # Backend dependencies
  ├── schema.sql                  # Database schema
  ├── seed-products.js            # Load sample data
  ├── generate-qr-codes.js        # Create QR codes
  ├── config/
  │   └── config.js              # Database config
  ├── models/                     # Database models (11 files)
  ├── controllers/                # Business logic (7 files)
  ├── routes/                     # API routes (7 files)
  ├── middleware/
  │   └── auth.js                # JWT validation
  └── utils/                      # Utilities

/frontend
  ├── public/
  │   ├── index.html
  │   └── qr-scanner.html        # Mobile QR scanner
  ├── src/
  │   ├── App.js                 # Main component
  │   ├── index.js               # React entry
  │   ├── pages/                 # 8 page components
  │   └── components/
  │       └── Navbar.js          # Navigation
  └── package.json               # Frontend dependencies
```

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASS=your_password
DB_NAME=roushan
DB_PORT=5432
DB_DIALECT=postgres
DB_SSL=false
JWT_SECRET=your-secret-key-change-in-production
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000
```

---

## Performance Tips

1. **Indexing**: Add indexes on frequently queried columns
2. **Caching**: Cache product list in local storage
3. **Pagination**: Add pagination to large data tables
4. **Batch Operations**: Combine multiple requests
5. **Database Cleanup**: Archive old invoices monthly

---

## What's Working

✅ All CRUD operations (Create, Read, Update, Delete)
✅ Authentication & JWT tokens
✅ Invoice creation without GST
✅ QR code generation and scanning
✅ Inventory batch management
✅ Sales analytics and reports
✅ PDF export
✅ Responsive mobile design
✅ Production-ready code

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 4000 in use | Change PORT in .env or `kill -9 <PID>` |
| CORS errors | Check FRONTEND_URL in backend .env |
| QR not scanning | Grant camera permissions, use HTTPS in production |
| Invoice not saving | Check customer_id exists in database |
| Batch not created | Check purchase invoice saved successfully |
| API timeout | Check database connection parameters |

---

## Next Steps

1. ✅ Test locally
2. ✅ Create test invoices and purchases
3. ✅ Export PDFs
4. ✅ Check QR scanner on mobile
5. 🚀 Deploy to Vercel (see VERCEL_DEPLOYMENT.md)
6. 🚀 Switch to Neon PostgreSQL
7. 🚀 Go live!

---

**Happy Testing! 🎉**

For complete deployment instructions, see `VERCEL_DEPLOYMENT.md`
For system features, see `FINAL_STATUS_REPORT.md`
For usage guide, see `SETUP_GUIDE.md`
