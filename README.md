# WhatsApp Store Integration

A complete e-commerce solution that allows customers to browse products, make payments, and get redirected back to WhatsApp with tracking information.

## Features

- 📱 Mobile-first responsive design
- 🛍️ Product catalog browsing
- 💳 Secure payment processing with Razorpay
- 📦 Order tracking
- 🔄 WhatsApp integration for order confirmation
- ✅ Payment verification and security

## Project Structure

```
website-host/
├── backend/          # Node.js API server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── .env         # Environment variables
└── frontend/         # Next.js React app
    ├── pages/        # Next.js pages
    │   ├── index.js  # Product catalog
    │   ├── success.js # Order success page
    │   └── product/
    │       └── [id].js # Dynamic product page
    ├── package.json  # Frontend dependencies
    └── ...
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

### 3. Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Update the `.env` file with your keys
4. Update the Razorpay key in the frontend code (search for "rzp_test_1234567890")

## Usage

### WhatsApp Integration URLs

1. **Product catalog**: `http://localhost:3000/?ref=whatsapp&phone=919999999999`
2. **Direct product**: `http://localhost:3000/product/1?ref=whatsapp&phone=919999999999`

### URL Parameters

- `ref`: Reference source (e.g., "whatsapp")
- `phone`: Customer's phone number for WhatsApp redirect

### API Endpoints

- `GET /api/products` - Get all products
- `GET /api/product/:id` - Get specific product
- `POST /api/create-order` - Create payment order
- `POST /api/verify-payment` - Verify payment
- `GET /api/order-status/:trackingId` - Get order status

## Sample Products

The system comes with 3 sample products:
1. Premium Headphones (₹2,999)
2. Smart Watch (₹8,999)
3. Bluetooth Speaker (₹1,999)

## WhatsApp Flow

1. Customer clicks product link from WhatsApp
2. Views product details and selects quantity
3. Initiates payment through Razorpay
4. After successful payment, gets tracking ID
5. Automatically redirected back to WhatsApp with order confirmation

## Security Features

- Payment signature verification
- CORS protection
- Secure environment variables
- Order tracking with unique IDs

## Customization

### Adding Products

Edit the `products` object in `backend/server.js`:

```javascript
const products = {
  '4': {
    id: '4',
    name: 'Your Product',
    price: 1999,
    description: 'Product description',
    image: '/images/product.jpg'
  }
};
```

### Styling

The frontend uses Tailwind CSS classes. Customize the appearance by modifying the className attributes in the React components.

## Production Deployment

### Backend
- Use a proper database (MongoDB, PostgreSQL)
- Implement proper logging
- Add rate limiting
- Use HTTPS
- Set up environment-specific configs

### Frontend
- Build the production version: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update API endpoints to production URLs

## Support

For issues and questions, contact through WhatsApp integration or create GitHub issues.

## License

MIT License
