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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed'));
  }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

const router = express.Router();

router.get('/', authMiddleware, inventoryController.list);
router.get('/product/:productId', authMiddleware, inventoryController.getByProduct);
router.post('/', authMiddleware, inventoryController.create);
router.put('/:id', authMiddleware, inventoryController.update);
router.post('/:id/bill', authMiddleware, upload.single('bill'), handleMulterError, inventoryController.uploadBill);
router.delete('/:id', authMiddleware, inventoryController.remove);

module.exports = router;