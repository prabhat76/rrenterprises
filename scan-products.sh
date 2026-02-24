#!/bin/bash

# Neon Product Scanner Script
# This script connects to the Neon database and retrieves all products
# Usage: ./scan-products.sh

NEON_URL="postgresql://neondb_owner:npg_w7mPGtrWo8jF@ep-fancy-snow-aib3um5n-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# SQL query to scan all products (like Tally inventory scan)
SQL_QUERY="
SELECT 
  id,
  name,
  hsn_code,
  price,
  description,
  created_at
FROM \"Products\"
ORDER BY name ASC;
"

echo "==========================================";
echo "   Product Scanning (Tally Style)";
echo "==========================================";
echo "";

# Connect to Neon and run the query
psql "$NEON_URL" << EOF
SET client_encoding = 'UTF8';

-- Set output format for better readability
\x auto
\pset border 2

-- Run the scan query
$SQL_QUERY

-- Show summary statistics
SELECT 
  COUNT(*) as total_products,
  COUNT(DISTINCT hsn_code) as unique_hsn_codes,
  MIN(price) as min_price,
  MAX(price) as max_price,
  ROUND(AVG(CAST(price AS numeric)), 2) as avg_price
FROM \"Products\";
EOF

echo "";
echo "==========================================";
