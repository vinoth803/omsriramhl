const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

// Sample products database (in production, use a real database)
const products = {
  '1': {
    id: '1',
    name: 'Premium Headphones',
    price: 2999,
    description: 'High-quality wireless headphones with noise cancellation',
    image: '/images/headphones.jpg'
  },
  '2': {
    id: '2',
    name: 'Smart Watch',
    price: 8999,
    description: 'Feature-rich smartwatch with health monitoring',
    image: '/images/smartwatch.jpg'
  },
  '3': {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 1999,
    description: 'Portable wireless speaker with excellent sound quality',
    image: '/images/speaker.jpg'
  }
};

// Generate unique tracking ID
function generateTrackingId() {
  return 'TRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// In-memory order database (in production, use a real database like MongoDB/PostgreSQL)
const orders = new Map();

// Order status types
const ORDER_STATUS = {
  PAYMENT_PENDING: 'payment_pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Create order record
function createOrderRecord(trackingId, orderData) {
  const order = {
    trackingId,
    orderId: orderData.orderId,
    paymentId: orderData.paymentId,
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    customerInfo: orderData.customerInfo,
    status: ORDER_STATUS.CONFIRMED,
    timeline: [
      {
        status: ORDER_STATUS.CONFIRMED,
        timestamp: new Date(),
        message: 'Order confirmed and payment received'
      }
    ],
    estimatedDelivery: calculateEstimatedDelivery(),
    shippingAddress: orderData.shippingAddress || 'Address to be updated',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  orders.set(trackingId, order);
  return order;
}

// Calculate estimated delivery (2-5 business days from now)
function calculateEstimatedDelivery() {
  const now = new Date();
  const deliveryDays = Math.floor(Math.random() * 4) + 2; // 2-5 days
  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + deliveryDays);
  return deliveryDate;
}

// Update order status
function updateOrderStatus(trackingId, newStatus, message) {
  const order = orders.get(trackingId);
  if (!order) return null;
  
  order.status = newStatus;
  order.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    message: message || getStatusMessage(newStatus)
  });
  order.updatedAt = new Date();
  
  // Update estimated delivery for shipped orders
  if (newStatus === ORDER_STATUS.SHIPPED) {
    order.estimatedDelivery = calculateEstimatedDelivery();
  }
  
  return order;
}

// Get status message
function getStatusMessage(status) {
  const messages = {
    [ORDER_STATUS.PAYMENT_PENDING]: 'Waiting for payment confirmation',
    [ORDER_STATUS.CONFIRMED]: 'Order confirmed and payment received',
    [ORDER_STATUS.PROCESSING]: 'Order is being prepared for shipping',
    [ORDER_STATUS.SHIPPED]: 'Order has been shipped and is on its way',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Order is out for delivery',
    [ORDER_STATUS.DELIVERED]: 'Order has been successfully delivered',
    [ORDER_STATUS.CANCELLED]: 'Order has been cancelled',
    [ORDER_STATUS.REFUNDED]: 'Order has been refunded'
  };
  return messages[status] || 'Status updated';
}

// Simulate order progression (for demo purposes)
function simulateOrderProgression(trackingId) {
  setTimeout(() => {
    updateOrderStatus(trackingId, ORDER_STATUS.PROCESSING);
  }, 2 * 60 * 1000); // 2 minutes - processing
  
  setTimeout(() => {
    updateOrderStatus(trackingId, ORDER_STATUS.SHIPPED);
  }, 5 * 60 * 1000); // 5 minutes - shipped
  
  setTimeout(() => {
    updateOrderStatus(trackingId, ORDER_STATUS.OUT_FOR_DELIVERY);
  }, 24 * 60 * 60 * 1000); // 1 day - out for delivery
  
  setTimeout(() => {
    updateOrderStatus(trackingId, ORDER_STATUS.DELIVERED);
  }, 25 * 60 * 60 * 1000); // 1 day 1 hour - delivered
}

// Get product details
app.get('/api/product/:id', (req, res) => {
  const productId = req.params.id;
  const product = products[productId];
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(Object.values(products));
});

// Create order
app.post('/api/create-order', async (req, res) => {
  try {
    const { productId, quantity = 1, items, ref } = req.body;
    
    let totalAmount = 0;
    let orderItems = [];
    let orderDescription = '';
    
    if (items && Array.isArray(items)) {
      // Cart order with multiple items
      for (const item of items) {
        const product = products[item.productId];
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found` });
        }
        const itemAmount = product.price * item.quantity;
        totalAmount += itemAmount;
        orderItems.push({
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
          amount: itemAmount
        });
      }
      orderDescription = `Cart order (${items.length} items)`;
    } else {
      // Single product order
      const product = products[productId];
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      totalAmount = product.price * quantity;
      orderItems.push({
        productId,
        productName: product.name,
        quantity,
        price: product.price,
        amount: totalAmount
      });
      orderDescription = `${product.name} x ${quantity}`;
    }

    const amount = totalAmount * 100; // Razorpay expects amount in paise
    
    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        ref: ref || 'direct',
        description: orderDescription,
        itemCount: orderItems.length
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Create order record in "database"
    const trackingId = generateTrackingId();
    const orderRecord = createOrderRecord(trackingId, {
      orderId: order.id,
      paymentId: null, // Payment ID will be updated after payment verification
      items: orderItems,
      totalAmount: totalAmount,
      customerInfo: null, // To be collected later
      shippingAddress: null // To be collected later
    });
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      items: orderItems,
      description: orderDescription,
      totalAmount: totalAmount,
      trackingId // Include tracking ID in response
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderItems, 
      totalAmount,
      customerInfo 
    } = req.body;
    
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment successful - create order record
      const trackingId = generateTrackingId();
      
      const orderData = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        items: orderItems || [],
        totalAmount: totalAmount || 0,
        customerInfo: customerInfo || {},
        shippingAddress: customerInfo?.address || 'Address to be updated'
      };
      
      // Create order record in database
      const order = createOrderRecord(trackingId, orderData);
      
      // Start order progression simulation (for demo)
      simulateOrderProgression(trackingId);
      
      console.log('Payment successful and order created:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        trackingId
      });
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        trackingId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        order: {
          trackingId,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery,
          items: order.items
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Get order status
app.get('/api/order-status/:trackingId', (req, res) => {
  const { trackingId } = req.params;
  
  const order = orders.get(trackingId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json({
    trackingId: order.trackingId,
    orderId: order.orderId,
    status: order.status,
    statusMessage: getStatusMessage(order.status),
    timeline: order.timeline,
    estimatedDelivery: order.estimatedDelivery,
    items: order.items,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  });
});

// Update order status (for admin/demo purposes)
app.put('/api/order-status/:trackingId', (req, res) => {
  const { trackingId } = req.params;
  const { status, message } = req.body;
  
  if (!Object.values(ORDER_STATUS).includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const order = updateOrderStatus(trackingId, status, message);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json({
    success: true,
    message: 'Order status updated',
    order: {
      trackingId: order.trackingId,
      status: order.status,
      timeline: order.timeline,
      updatedAt: order.updatedAt
    }
  });
});

// Get all orders (for admin purposes)
app.get('/api/orders', (req, res) => {
  const allOrders = Array.from(orders.values()).map(order => ({
    trackingId: order.trackingId,
    orderId: order.orderId,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    estimatedDelivery: order.estimatedDelivery
  }));
  
  res.json(allOrders);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Create sample orders for demo purposes
  createSampleOrders();
});

// Create sample orders for demo
function createSampleOrders() {
  const sampleOrders = [
    {
      trackingId: 'TRK123456',
      orderId: 'order_demo123456',
      paymentId: 'pay_demo123456',
      items: [
        {
          productId: '1',
          productName: 'Premium Headphones',
          quantity: 1,
          price: 2999,
          amount: 2999
        }
      ],
      totalAmount: 2999,
      customerInfo: { phone: '919999999999', ref: 'demo' },
      status: ORDER_STATUS.SHIPPED,
      timeline: [
        {
          status: ORDER_STATUS.CONFIRMED,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          message: 'Order confirmed and payment received'
        },
        {
          status: ORDER_STATUS.PROCESSING,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          message: 'Order is being prepared for shipping'
        },
        {
          status: ORDER_STATUS.SHIPPED,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          message: 'Order has been shipped and is on its way'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      shippingAddress: '123 Demo Street, Demo City, 12345',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      trackingId: 'TRK789012',
      orderId: 'order_demo789012',
      paymentId: 'pay_demo789012',
      items: [
        {
          productId: '2',
          productName: 'Smart Watch',
          quantity: 1,
          price: 8999,
          amount: 8999
        },
        {
          productId: '3',
          productName: 'Bluetooth Speaker',
          quantity: 2,
          price: 1999,
          amount: 3998
        }
      ],
      totalAmount: 12997,
      customerInfo: { phone: '919888888888', ref: 'cart' },
      status: ORDER_STATUS.OUT_FOR_DELIVERY,
      timeline: [
        {
          status: ORDER_STATUS.CONFIRMED,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          message: 'Order confirmed and payment received'
        },
        {
          status: ORDER_STATUS.PROCESSING,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          message: 'Order is being prepared for shipping'
        },
        {
          status: ORDER_STATUS.SHIPPED,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          message: 'Order has been shipped and is on its way'
        },
        {
          status: ORDER_STATUS.OUT_FOR_DELIVERY,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          message: 'Order is out for delivery'
        }
      ],
      estimatedDelivery: new Date(Date.now() + 6 * 60 * 60 * 1000),
      shippingAddress: '456 Sample Avenue, Test City, 67890',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      trackingId: 'TRK345678',
      orderId: 'order_demo345678',
      paymentId: 'pay_demo345678',
      items: [
        {
          productId: '3',
          productName: 'Bluetooth Speaker',
          quantity: 1,
          price: 1999,
          amount: 1999
        }
      ],
      totalAmount: 1999,
      customerInfo: { phone: '919777777777', ref: 'whatsapp' },
      status: ORDER_STATUS.DELIVERED,
      timeline: [
        {
          status: ORDER_STATUS.CONFIRMED,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          message: 'Order confirmed and payment received'
        },
        {
          status: ORDER_STATUS.PROCESSING,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          message: 'Order is being prepared for shipping'
        },
        {
          status: ORDER_STATUS.SHIPPED,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          message: 'Order has been shipped and is on its way'
        },
        {
          status: ORDER_STATUS.OUT_FOR_DELIVERY,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          message: 'Order is out for delivery'
        },
        {
          status: ORDER_STATUS.DELIVERED,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          message: 'Order has been successfully delivered'
        }
      ],
      estimatedDelivery: new Date(Date.now() - 12 * 60 * 60 * 1000),
      shippingAddress: '789 Example Road, Sample Town, 54321',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  ];

  sampleOrders.forEach(orderData => {
    orders.set(orderData.trackingId, orderData);
  });

  console.log('Sample orders created for demo:', sampleOrders.map(o => o.trackingId));
}
