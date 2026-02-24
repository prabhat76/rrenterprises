# Sales Analytics API Documentation

## 📊 Overview
Complete sales analytics system for tracking product performance, revenue, and business metrics - Tally style!

---

## 🔧 API Endpoints

### 1. **Sales Analytics by Product**
Detailed sales metrics for each product with min/max/avg analysis

```bash
GET /api/products/analytics/sales?startDate=2024-01-01&endDate=2024-12-31&productId=123
```

**Response:**
```json
{
  "summary": {
    "totalProducts": 15,
    "totalQuantitySold": 250,
    "totalRevenue": 75000,
    "avgRevenuePerProduct": 5000
  },
  "sales": [
    {
      "product": { "id": 1, "name": "Product A", "hsn_code": "HSN001", "price": "100.00" },
      "totalQuantity": 50,
      "totalRevenue": 5000,
      "minSale": 100,
      "maxSale": 500,
      "avgSale": 250,
      "saleCount": 20
    }
  ]
}
```

---

### 2. **Top Sellers**
Ranked list of best-selling products

```bash
GET /api/products/analytics/topSellers?limit=10&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "period": { "startDate": "2024-01-01", "endDate": "2024-12-31" },
  "topSellers": [
    {
      "rank": 1,
      "product": { "id": 5, "name": "Star Product", "price": "500.00" },
      "timeSold": 45,
      "totalQuantity": 120,
      "totalRevenue": 60000,
      "avgPrice": 500
    }
  ]
}
```

---

### 3. **Slow Movers**
Products with least sales (inventory optimization)

```bash
GET /api/products/analytics/slowMovers?limit=10&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "period": { "startDate": "2024-01-01", "endDate": "2024-12-31" },
  "slowMovers": [
    {
      "rank": 1,
      "product": { "id": 12, "name": "Slow Product", "price": "50.00" },
      "totalQuantity": 2,
      "totalRevenue": 100
    }
  ]
}
```

---

### 4. **Sales Summary**
Daily revenue breakdown and statistics

```bash
GET /api/products/analytics/summary?startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "period": { "startDate": "2024-01-01", "endDate": "2024-12-31" },
  "globalStats": {
    "totalRevenue": 500000,
    "totalInvoices": 250,
    "avgInvoiceValue": 2000,
    "minInvoice": 100,
    "maxInvoice": 50000
  },
  "dailySummary": [
    {
      "date": "2024-12-31",
      "dailyRevenue": 5000,
      "invoiceCount": 10,
      "avgInvoiceValue": 500
    }
  ]
}
```

---

## 🖥️ CLI Tools

### Analytics Report
Generate comprehensive Tally-style sales report in terminal

```bash
# Generate report for all products (last 30 days)
cd backend && node analytics-report.js

# Generate report for specific date range
node analytics-report.js --start=2024-01-01 --end=2024-12-31

# Generate report for specific product
node analytics-report.js --product=5
```

### Product Scanner
Quick product lookup (HSN or name)

```bash
# Scan all products
node scan-products.js

# Search by product name
node scan-products.js "Product Name"

# Search by HSN code
node scan-products.js "HSN001"
```

---

## 📋 Query Parameters

All analytics endpoints accept:
- `startDate` (YYYY-MM-DD) - Start date for analysis
- `endDate` (YYYY-MM-DD) - End date for analysis
- `limit` (default: 10) - Number of results to return
- `productId` - Filter by specific product ID

---

## 📊 Key Metrics Tracked

### Per Product:
- ✅ Total Quantity Sold
- ✅ Total Revenue
- ✅ Min Sale Amount
- ✅ Max Sale Amount
- ✅ Average Sale Amount
- ✅ Number of Times Sold

### Overall:
- ✅ Total Revenue
- ✅ Total Invoices
- ✅ Average Invoice Value
- ✅ Min/Max Invoice Amount
- ✅ Daily Revenue Trends
- ✅ Top 5 Bestsellers
- ✅ Top 5 Slow Movers

---

## 🔐 Authentication
All API endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

CLI tools work without authentication (local database access).

---

## 💾 Data Source
- Works with both **local PostgreSQL** and **Neon cloud database**
- Real-time calculation from invoice data
- Aggregated statistics for performance

---

## 📈 Use Cases

1. **Sales Performance Analysis** - Track which products generate most revenue
2. **Inventory Management** - Identify slow-moving products
3. **Business Insights** - Daily revenue trends and patterns
4. **Financial Reporting** - Complete sales breakdown by product
5. **Decision Making** - Data-driven product stocking decisions

