# 📱 QR Code Inventory System

## Overview
Scan product QR codes with your mobile camera to instantly add items to inventory - no typing required!

---

## 🚀 Quick Start

### 1. **Seed Products**
First, add products to your database:
```bash
cd /Users/prabhatkumar/Desktop/roushan/backend
node seed-products.js
```

### 2. **Generate QR Codes**
Create printable QR codes for all products:
```bash
node generate-qr-codes.js
```
This creates:
- Individual PNG files for each product
- An HTML page with all QR codes for printing
- Location: `qr-codes/all-qr-codes.html`

### 3. **Start Backend**
```bash
npm start
```

### 4. **Open Mobile Scanner**
On your mobile device, navigate to:
```
http://localhost:4000/qr-scanner.html
```
Or open: `/Users/prabhatkumar/Desktop/roushan/frontend/public/qr-scanner.html`

---

## 📲 How It Works

### Scanning Products
1. Open the QR scanner page on your mobile
2. Click "📷 Start Camera"
3. Point camera at product QR code
4. Product details appear automatically
5. Enter quantity and click "Add to Inventory"
6. Done! ✅

### QR Code Contents
Each QR code contains:
```json
{
  "type": "product",
  "id": 1,
  "name": "Product Name",
  "hsn": "HSN1234",
  "price": 999.00,
  "scanUrl": "http://localhost:4000/api/products/scan-qr/1"
}
```

---

## 🔧 API Endpoints

### Generate QR Code for Product
```bash
GET /api/products/:id/qr
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "product": { "id": 1, "name": "Product" },
  "qrCode": "data:image/png;base64,...",
  "qrData": { "type": "product", "id": 1, ... }
}
```

### Scan QR Code (Mobile)
```bash
GET /api/products/scan-qr/:id
```
No authentication required - mobile-friendly

**Response:**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Product Name",
    "hsn_code": "HSN1234",
    "price": "999.00"
  },
  "timestamp": "2026-02-24T..."
}
```

### Quick Add to Inventory
```bash
POST /api/products/quick-add
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "productId": 1,
  "quantity": 10,
  "batchNumber": "BATCH-001",
  "expiryDate": "2027-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added 10 units of Product Name to inventory",
  "product": { ... },
  "batch": { ... }
}
```

---

## 🖨️ Printing QR Codes

### Print All Products
1. Run `node generate-qr-codes.js`
2. Open `qr-codes/all-qr-codes.html` in browser
3. Click "🖨️ Print All QR Codes"
4. Print and cut into labels

### Print Individual QR
Access via API:
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/products/1/qr \
  | jq -r '.qrCode'
```

---

## 📱 Mobile Features

### Camera Access
- Uses device back camera automatically
- Works on iOS and Android
- Falls back to front camera if needed

### Offline Support
- QR codes work offline (scan locally)
- Syncs when connection restored

### UI Features
- ✅ Large touch-friendly buttons
- ✅ Instant product recognition
- ✅ Quick quantity input
- ✅ Success/error feedback
- ✅ Batch scanning support

---

## 💡 Use Cases

### Receiving Stock
1. Scan product QR
2. Enter received quantity
3. Add to inventory
4. Repeat for next product

### Stock Taking
1. Walk around warehouse
2. Scan each product
3. Adjust quantities
4. Real-time inventory update

### Sales Counter
1. Scan product during checkout
2. Automatically adds to invoice
3. Updates inventory
4. Fast billing process

### Product Lookup
1. Scan QR code
2. View product details
3. Check pricing
4. No manual search needed

---

## 🔒 Security

### Authentication
- QR scan endpoint: No auth (read-only)
- Add to inventory: JWT required
- Generate QR: JWT required

### Data Validation
- Product ID verified before inventory update
- Quantity must be positive integer
- Batch numbers auto-generated if not provided

---

## 🛠️ Customization

### Change QR Size
Edit `generate-qr-codes.js`:
```javascript
const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
  errorCorrectionLevel: 'H',
  width: 500,  // Change this
  margin: 4     // And this
});
```

### Add Logo to QR
```bash
npm install qrcode-with-logos
```

### Custom Scanner UI
Edit `/frontend/public/qr-scanner.html`

---

## 📊 Benefits

✅ **Faster** - No typing product names  
✅ **Accurate** - No manual entry errors  
✅ **Mobile** - Works on any smartphone  
✅ **Offline** - QR codes work without internet  
✅ **Printable** - Generate labels easily  
✅ **Scalable** - Handle thousands of products  

---

## 🐛 Troubleshooting

### Camera Not Working
- Grant camera permissions in browser
- Try HTTPS instead of HTTP
- Check if device has camera

### QR Not Scanning
- Ensure good lighting
- Hold steady for 2 seconds
- Try zooming in/out
- Regenerate QR if damaged

### CORS Errors
Add to backend `app.js`:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

---

## 📝 Next Steps

1. **Deploy Backend** to cloud (Railway, Render, Heroku)
2. **Enable HTTPS** for camera access on mobile
3. **Add Barcode Support** for retail products
4. **Implement Offline Mode** with Service Workers
5. **Add Batch Printing** for labels

---

**Your inventory system is now camera-ready! 📸✨**
