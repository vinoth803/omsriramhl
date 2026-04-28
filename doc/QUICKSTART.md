# OmSaiRam HandLooms - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
1. **Install Node.js** (if not already installed):
   - Go to [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version
   - Restart your terminal after installation

### 🔧 Setup Steps

1. **Run the setup script**:
   ```bash
   # On Windows
   setup.bat
   
   # Or manually:
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure Razorpay** (Required for payments):
   - Sign up at [razorpay.com](https://razorpay.com/)
   - Get your API keys from dashboard
   - Update `backend/.env`:
     ```env
     RAZORPAY_KEY_ID=your_key_here
     RAZORPAY_KEY_SECRET=your_secret_here
     ```
   - Update frontend Razorpay key in `pages/product/[id].js` (line 58)

3. **Start the servers**:
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access your store**:
   - Main store: http://localhost:3000
   - From WhatsApp: http://localhost:3000/?ref=whatsapp&phone=919999999999

## 📱 WhatsApp Integration

### How it works:
1. Customer clicks your WhatsApp link
2. Views products and places order
3. Makes secure payment via Razorpay
4. Gets tracking ID and redirects back to WhatsApp

### Sample WhatsApp Link:
```
Check out our products: http://localhost:3000/?ref=whatsapp&phone=919999999999
```

### Sample Product Link:
```
Premium Headphones: http://localhost:3000/product/1?ref=whatsapp&phone=919999999999
```

## 🛍️ Available Products

1. **Premium Headphones** - ₹2,999
2. **Smart Watch** - ₹8,999  
3. **Bluetooth Speaker** - ₹1,999

## 🔧 Customization

### Add New Products:
Edit `backend/server.js` - products object:

```javascript
'4': {
  id: '4',
  name: 'Your Product',
  price: 1999,
  description: 'Product description',
  image: '/images/product.jpg'
}
```

### Change Styling:
Modify Tailwind CSS classes in React components.

## 🚨 Important Notes

- Replace Razorpay test keys with live keys for production
- The current setup uses test data - implement a real database for production
- Add proper error handling and logging for production use

## 📞 Support

If you need help, feel free to ask!
