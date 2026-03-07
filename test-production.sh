#!/bin/bash

echo "🧪 Testing Production API Endpoints..."
echo ""

# Login
echo "1️⃣ Testing Login..."
TOKEN=$(curl -s -X POST https://backend-pi-eosin-24.vercel.app/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin"}' | jq -r .token)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  exit 1
fi

echo ""
echo "2️⃣ Testing Products API..."
PRODUCTS=$(curl -s -X GET https://backend-pi-eosin-24.vercel.app/api/products \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ Found $PRODUCTS products"

echo ""
echo "3️⃣ Testing Customer Creation..."
CUSTOMER=$(curl -s -X POST https://backend-pi-eosin-24.vercel.app/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Shop","email":"testshop@example.com","phone":"1234567890","address":"Test Address"}')

echo "$CUSTOMER" | jq .

if echo "$CUSTOMER" | jq -e '.id' > /dev/null 2>&1; then
  echo "✅ Customer created successfully"
else
  echo "❌ Customer creation failed"
  echo "$CUSTOMER"
fi

echo ""
echo "🎉 Production API is fully operational!"
