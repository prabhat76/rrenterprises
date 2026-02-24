# RR Enterprises Billing Application

A comprehensive billing and inventory management system for RR Enterprises. Built with React frontend and Node.js/Express backend with PostgreSQL database.

## Features

- **Invoice Management**: Create, edit, delete, and view invoices with GST support
- **Customer Management**: Maintain customer database with GSTIN
- **Product Management**: Manage products with HSN codes and photo uploads
- **Purchase Invoices**: Track supplier purchases and update inventory
- **Inventory Management**: Batch-wise inventory tracking with expiry dates
- **Payment Tracking**: Record and track payments against invoices
- **Reports & Analytics**: Sales, payment, and purchase reports with charts
- **PDF Export**: Generate and download invoices as PDF
- **User Authentication**: Secure login with JWT tokens

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Recharts, Axios
- **Backend**: Node.js, Express 4
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcrypt

## Project Structure

```
roushan/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── schema.sql
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm or yarn

### Backend Setup

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

4. Configure environment variables in `.env`:
```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=roushan
JWT_SECRET=your_secret_key
```

5. Start the backend server:
```bash
npm start
```

Server runs on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/photo` - Upload product photo

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/payment` - Record payment

### Inventory
- `GET /api/inventory` - List all batches
- `GET /api/inventory/product/:productId` - Get batches for product
- `POST /api/inventory` - Create batch
- `PUT /api/inventory/:id` - Update batch
- `DELETE /api/inventory/:id` - Delete batch

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/payments` - Payment report
- `GET /api/reports/purchases` - Purchase report

## Features Details

### Invoice with GST
- Support for CGST, SGST, IGST
- Automatic tax calculation
- Payment tracking and history

### Inventory Management
- Batch tracking
- Expiry date management
- Stock updates from purchases

### Photo Upload
- Products can have multiple photos
- Photo management interface

### Purchase Invoices
- Track supplier information
- GST support on purchase invoices
- Automatic inventory updates

### Reports
- Sales reports with date filtering
- Payment tracking reports
- Purchase reports
- Visual charts with Recharts
- Export capabilities

## Database Schema

Main tables:
- `users` - User accounts
- `customers` - Customer information
- `products` - Product catalog
- `services` - Service offerings
- `invoices` - Sales invoices
- `invoice_items` - Line items in invoices
- `transactions` - Payments recorded
- `purchase_invoices` - Supplier invoices
- `purchase_items` - Items in purchase invoices
- `inventory_batches` - Product batches
- `product_photos` - Product images

## Security

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation

## Future Enhancements

- Email notifications
- Multi-user roles and permissions
- Advanced inventory forecasting
- API rate limiting
- Integration with payment gateways
- Mobile app
- Bulk invoice generation
- Subscription management

## Support

For issues and questions, please contact the development team.

## License

ISC