const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');

// Configure multer for bill uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/bills' : 'uploads/bills';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'bill-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed'));
  }
});

const router = express.Router();

router.get('/', authMiddleware, inventoryController.list);
router.get('/product/:productId', authMiddleware, inventoryController.getByProduct);
router.post('/', authMiddleware, inventoryController.create);
router.put('/:id', authMiddleware, inventoryController.update);
router.post('/:id/bill', authMiddleware, upload.single('bill'), inventoryController.uploadBill);
router.delete('/:id', authMiddleware, inventoryController.remove);

module.exports = router;