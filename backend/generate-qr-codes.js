#!/usr/bin/env node
/**
 * Generate QR Codes for All Products
 * Creates printable QR code sheet
 * Usage: node generate-qr-codes.js
 */

require('dotenv').config();
const { sequelize, Product } = require('./models');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRCodes() {
  try {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║    QR CODE GENERATOR FOR PRODUCTS     ║');
    console.log('╚═══════════════════════════════════════╝\n');

    console.log('🔗 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected!\n');

    const products = await Product.findAll({
      attributes: ['id', 'name', 'hsn_code', 'price'],
      order: [['id', 'ASC']]
    });

    if (products.length === 0) {
      console.log('❌ No products found. Please seed the database first.');
      process.exit(1);
    }

    console.log(`📦 Found ${products.length} products\n`);
    console.log('🎨 Generating QR codes...\n');

    // Create output directory
    const outputDir = path.join(__dirname, '../qr-codes');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate HTML page with all QR codes
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Product QR Codes</title>
    <style>
        @media print {
            .no-print { display: none; }
            .qr-item { page-break-inside: avoid; }
            body { padding: 10px; }
        }
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        .qr-item {
            border: 2px solid #333;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
        }
        .qr-item h3 {
            margin: 10px 0;
            font-size: 14px;
        }
        .qr-item p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }
        .qr-item img {
            width: 200px;
            height: 200px;
        }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }
        
        /* Tablet Responsive */
        @media (max-width: 1024px) {
            .qr-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
        }
        
        /* Mobile Responsive */
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            .qr-grid {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            .qr-item {
                padding: 10px;
            }
            .qr-item img {
                width: 150px;
                height: 150px;
            }
            .header h1 {
                font-size: 20px;
            }
            .btn {
                width: 100%;
                margin: 5px 0;
            }
        }
    </style>
            color: #666;
        }
        .qr-item img {
            width: 200px;
            height: 200px;
        }
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="header no-print">
        <h1>📦 Product QR Codes</h1>
        <p>Total Products: ${products.length}</p>
        <button class="btn" onclick="window.print()">🖨️ Print All QR Codes</button>
    </div>
    <div class="qr-grid">
`;

    for (const product of products) {
      const qrData = {
        type: 'product',
        id: product.id,
        name: product.name,
        hsn: product.hsn_code,
        price: product.price,
        scanUrl: `http://localhost:4000/api/products/scan-qr/${product.id}`
      };

      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 2
      });

      // Save individual QR code
      const filename = `product-${product.id}-qr.png`;
      const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(outputDir, filename), base64Data, 'base64');

      // Add to HTML
      html += `
        <div class="qr-item">
            <img src="${qrCodeDataURL}" alt="QR Code for ${product.name}" />
            <h3>${product.name}</h3>
            <p><strong>ID:</strong> ${product.id}</p>
            <p><strong>HSN:</strong> ${product.hsn_code}</p>
            <p><strong>Price:</strong> ₹${product.price}</p>
        </div>
      `;

      console.log(`✅ Generated QR for: ${product.name} (ID: ${product.id})`);
    }

    html += `
    </div>
</body>
</html>
`;

    // Save HTML file
    const htmlPath = path.join(outputDir, 'all-qr-codes.html');
    fs.writeFileSync(htmlPath, html);

    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║         QR CODES GENERATED!           ║');
    console.log('╚═══════════════════════════════════════╝\n');
    
    console.log(`📁 Output Directory: ${outputDir}`);
    console.log(`📄 HTML File: ${htmlPath}`);
    console.log(`\n✨ Open the HTML file in a browser to view and print all QR codes!\n`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

generateQRCodes();
