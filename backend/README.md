# Backend API - RR Enterprises Billing

REST API for RR Enterprises billing and inventory management system.

## Quick Start

```bash
npm install
npm start
```

Server runs on `http://localhost:4000`

## Environment Variables

Create `.env` file in backend directory:

```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=roushan
JWT_SECRET=your_jwt_secret_key
```

## Project Structure

### Models (`/models`)
- User - User authentication
- Customer - Customer information
- Product - Product catalog
- Service - Service offerings
- Invoice - Sales invoices
- InvoiceItem - Line items
- Transaction - Payments
- PurchaseInvoice - Supplier invoices
- PurchaseItem - Purchase items
- InventoryBatch - Batch tracking
- ProductPhoto - Product images

### Controllers (`/controllers`)
- `authController` - User registration and login
- `customerController` - Customer CRUD operations
- `productController` - Product management
- `invoiceController` - Invoice management
- `purchaseController` - Purchase invoice handling
- `inventoryController` - Batch management
- `reportController` - Report generation

### Routes (`/routes`)
- `/api/auth` - Authentication endpoints
- `/api/customers` - Customer endpoints
- `/api/products` - Product endpoints
- `/api/invoices` - Invoice endpoints
- `/api/purchases` - Purchase endpoints
- `/api/inventory` - Inventory endpoints
- `/api/reports` - Report endpoints

### Middleware (`/middleware`)
- `auth.js` - JWT verification middleware

### Configuration (`/config`)
- `config.js` - Database configuration for different environments

### Utils (`/utils`)
- `generateInvoiceNumber.js` - Invoice number generation logic

## API Documentation

### Authentication

#### Register User
```
POST /api/auth/register
Body: { username, password, email }
```

#### Login
```
POST /api/auth/login
Body: { username, password }
Response: { token }
```

### Customers

#### List All
```
GET /api/customers
```

#### Create
```
POST /api/customers
Body: { name, email, phone, address, gstin }
```

#### Get by ID
```
GET /api/customers/:id
```

#### Update
```
PUT /api/customers/:id
Body: { name, email, phone, address, gstin }
```

#### Delete
```
DELETE /api/customers/:id
```

### Products

#### List All
```
GET /api/products
```

#### Create
```
POST /api/products
Body: { name, description, price, hsn_code }
```

#### Get by ID
```
GET /api/products/:id
```

#### Update
```
PUT /api/products/:id
```

#### Delete
```
DELETE /api/products/:id
```

#### Upload Photo
```
POST /api/products/:id/photo
Headers: Content-Type: multipart/form-data
File: photo
```

### Invoices

#### List All
```
GET /api/invoices
```

#### Create
```
POST /api/invoices
Body: { customer_id, invoice_date, due_date, total_amount, cgst_amount, sgst_amount, igst_amount, status }
```

#### Get by ID
```
GET /api/invoices/:id
```

#### Update
```
PUT /api/invoices/:id
```

#### Delete
```
DELETE /api/invoices/:id
```

#### Record Payment
```
POST /api/invoices/:id/payment
Body: { amount, transaction_date, payment_method, notes }
```

### Inventory

#### List All Batches
```
GET /api/inventory
```

#### Get by Product
```
GET /api/inventory/product/:productId
```

#### Create Batch
```
POST /api/inventory
Body: { product_id, batch_number, quantity, expiry_date }
```

#### Update Batch
```
PUT /api/inventory/:id
```

#### Delete Batch
```
DELETE /api/inventory/:id
```

### Reports

#### Sales Report
```
GET /api/reports/sales?startDate=2026-01-01&endDate=2026-12-31
```

#### Payment Report
```
GET /api/reports/payments?startDate=2026-01-01&endDate=2026-12-31
```

#### Purchase Report
```
GET /api/reports/purchases?startDate=2026-01-01&endDate=2026-12-31
```

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

Successful response:
```json
{
  "id": 1,
  "name": "John Doe",
  ...
}
```

Error response:
```json
{
  "error": "Error message"
}
```

## Database

PostgreSQL database with the following main entities:
- Users
- Customers
- Products
- Services
- Invoices
- Inventory Batches
- Photos
- Transactions

## Dependencies

- `express` - Web framework
- `sequelize` - ORM
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `multer` - File uploads
- `dotenv` - Environment variables

## Development

```bash
npm install
npm run dev
```

Uses nodemon for auto-restart on file changes.

## Error Handling

- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

All errors return JSON with `error` key.