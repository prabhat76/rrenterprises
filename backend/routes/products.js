const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer storage for serverless
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/products' : 'uploads/products';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', authMiddleware, productController.list);
router.get('/scan', productController.scan); // Tally-style scanner (no auth required)
router.get('/scan-qr/:id', productController.scanQR); // QR scan endpoint (no auth for mobile)
router.post('/quick-add', authMiddleware, productController.quickAddInventory); // Quick add to inventory
router.get('/analytics/sales', authMiddleware, productController.salesAnalytics); // Sales per product
router.get('/analytics/topSellers', authMiddleware, productController.topSellers); // Top sellers
router.get('/analytics/slowMovers', authMiddleware, productController.slowMovers); // Slow movers
router.get('/analytics/summary', authMiddleware, productController.salesSummary); // Daily summary
router.post('/', authMiddleware, productController.create);
router.get('/:id', authMiddleware, productController.get);
router.get('/:id/qr', authMiddleware, productController.generateQR); // Generate QR code
router.put('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.remove);
router.post('/:id/photo', authMiddleware, upload.single('photo'), productController.uploadPhoto);

module.exports = router;