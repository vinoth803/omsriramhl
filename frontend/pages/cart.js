import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [ordering, setOrdering] = useState(false);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setOrdering(true);

    try {
      // Transform cart items to match backend API expectations
      const cartItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // Create order for all items in cart
      const orderResponse = await axios.post("http://localhost:5001/api/create-order", {
        items: cartItems,
        ref: "cart"
      });

      const order = orderResponse.data;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          initiatePayment(order);
        };
      } else {
        initiatePayment(order);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setOrdering(false);
    }
  };

  const initiatePayment = (order) => {
    const options = {
      key: "rzp_test_Sj1qqe8BTgyBDw", // Your Razorpay test key
      amount: order.amount,
      currency: "INR",
      name: "Saree Collection",
      description: `Cart Checkout - ${getTotalItems()} items`,
      order_id: order.id,
      handler: async function (response) {
        try {
          // Verify payment
          const verifyResponse = await axios.post("http://localhost:5001/api/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyResponse.data.success) {
            const trackingId = verifyResponse.data.trackingId;
            
            // Clear cart after successful payment
            clearCart();
            
            // Show success message
            alert(`✅ Order Confirmed! Tracking ID: ${trackingId}`);
          } else {
            alert('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed');
        } finally {
          setOrdering(false);
        }
      },
      theme: {
        color: "#d53f8c"
      },
      modal: {
        ondismiss: function() {
          setOrdering(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ marginRight: '16px' }}>
              <svg style={{ width: '24px', height: '24px', color: '#718096' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#d53f8c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>🛒</span>
            </div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c' }}>Shopping Cart</h1>
          </div>
        </div>

        {/* Empty Cart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#718096', marginBottom: '24px', textAlign: 'center' }}>
            Browse our beautiful saree collection and add items to your cart
          </p>
          <Link
            href="/"
            style={{
              backgroundColor: '#d53f8c',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Browse Sarees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ marginRight: '16px' }}>
              <svg style={{ width: '24px', height: '24px', color: '#718096' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#d53f8c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>🛒</span>
            </div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c' }}>
              Shopping Cart ({getTotalItems()})
            </h1>
          </div>
          <button
            onClick={clearCart}
            style={{
              color: '#e53e3e',
              fontSize: '0.875rem',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div style={{ maxWidth: '28rem', margin: '16px auto', padding: '0 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          {cart.map((item, index) => (
            <div key={item.id} style={{ 
              padding: '16px', 
              borderBottom: index < cart.length - 1 ? '1px solid #e2e8f0' : 'none',
              display: 'flex',
              gap: '16px'
            }}>
              {/* Product Image */}
              <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(to bottom right, #fbb6ce, #d6bcfa)' }}>
                <img 
                  src={`http://localhost:5001/sarees/${item.image}`}
                  alt={item.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(to bottom right, #fbb6ce, #d6bcfa)', 
                  display: 'none', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '2rem' }}>👘</span>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '8px' }}>
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #cbd5e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1rem', fontWeight: '600', minWidth: '32px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #cbd5e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Price & Remove */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#d53f8c', marginBottom: '4px' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        color: '#e53e3e',
                        fontSize: '0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div style={{ marginTop: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c', marginBottom: '16px' }}>
            Order Summary
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#718096' }}>Items ({getTotalItems()})</span>
            <span style={{ color: '#1a202c' }}>₹{getTotalPrice().toLocaleString()}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#718096' }}>Delivery</span>
            <span style={{ color: '#48bb78' }}>Free</span>
          </div>
          
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d53f8c' }}>
                ₹{getTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={ordering}
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: ordering ? 'not-allowed' : 'pointer',
              backgroundColor: ordering ? '#a0aec0' : '#d53f8c',
              color: 'white',
              transition: 'background-color 0.15s ease-in-out'
            }}
          >
            {ordering ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Processing...
              </span>
            ) : (
              `💳 Proceed to Checkout - ₹${getTotalPrice().toLocaleString()}`
            )}
          </button>
        </div>

        {/* Continue Shopping */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{ color: '#d53f8c', fontWeight: '500', textDecoration: 'none' }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
