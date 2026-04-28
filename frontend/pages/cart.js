import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Head from 'next/head';
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
      name: "OmSaiRam HandLooms",
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
      <>
        <Head>
          <title>Shopping Cart - OmSaiRam HandLooms</title>
          <meta name="description" content="Your shopping cart for premium sarees and handwoven materials" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
          {/* Professional Header */}
          <header className="backdrop-blur-md bg-white/90 border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ॐ</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-playfair font-bold" style={{ color: '#2d5016' }}>OmSaiRam HandLooms</h1>
                    <p className="text-xs text-gray-500 font-light">SHOPPING CART</p>
                  </div>
                </Link>
                
                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                    Collection
                  </Link>
                  <Link href="/materials" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                    Materials
                  </Link>
                  <Link href="/track" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                    Track Order
                  </Link>
                </nav>

                {/* Mobile menu */}
                <div className="md:hidden flex items-center space-x-4">
                  <Link href="/" className="text-gray-700 text-sm">Collection</Link>
                  <Link href="/materials" className="text-gray-700 text-sm">Materials</Link>
                  <Link href="/track" className="text-gray-700 text-sm">Track</Link>
                </div>
              </div>
            </div>
          </header>

          {/* Empty Cart Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-green-600/10"></div>
                <div className="relative px-8 py-16 text-center">
                  <div className="text-8xl mb-6">🛒</div>
                  <h2 className="text-4xl font-playfair font-bold gradient-text mb-4">
                    Your Cart is Empty
                  </h2>
                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8 font-light">
                    Discover our beautiful collection of traditional and modern sarees, 
                    handcrafted with love and tradition
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link 
                      href="/"
                      className="bg-gradient-to-r from-amber-600 to-green-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all transform hover:scale-105 hover:shadow-2xl shadow-xl"
                      style={{
                        backgroundColor: '#92400e !important', // Very dark fallback
                        backgroundImage: 'linear-gradient(to right, #92400e, #047857)',
                        color: '#ffffff !important',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      Browse Collection
                    </Link>
                    <Link 
                      href="/materials"
                      className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:border-gray-400 transition-all shadow-lg"
                      style={{
                        boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      Explore Materials
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({getTotalItems()}) - OmSaiRam HandLooms</title>
        <meta name="description" content="Review your selected premium sarees and handwoven materials" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
        {/* Professional Header */}
        <header className="backdrop-blur-md bg-white/90 border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ॐ</span>
                </div>
                <div>
                  <h1 className="text-xl font-playfair font-bold" style={{ color: '#2d5016' }}>OmSaiRam HandLooms</h1>
                  <p className="text-xs text-gray-500 font-light">SHOPPING CART</p>
                </div>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                  Collection
                </Link>
                <Link href="/materials" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                  Materials
                </Link>
                <Link href="/track" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                  Track Order
                </Link>
              </nav>

              {/* Mobile menu */}
              <div className="md:hidden flex items-center space-x-4">
                <Link href="/" className="text-gray-700 text-sm">Collection</Link>
                <Link href="/materials" className="text-gray-700 text-sm">Materials</Link>
                <Link href="/track" className="text-gray-700 text-sm">Track</Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              {/* Cart Header */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden mb-6"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                }}
              >
                <div className="px-8 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-playfair font-bold gradient-text mb-2">
                        Shopping Cart
                      </h2>
                      <p className="text-gray-600 font-light">
                        {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                      </p>
                    </div>
                    <button
                      onClick={clearCart}
                      className="bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 px-4 py-2 rounded-lg font-medium transition-all shadow-md border border-red-300/50"
                      style={{
                        boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4 max-w-4xl">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden max-w-full"
                    style={{
                      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Product Image - Extra compact size */}
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={`http://localhost:5001/sarees/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          style={{ maxWidth: '48px', maxHeight: '48px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-amber-200 to-green-300 flex items-center justify-center" style={{display: 'none'}}>
                          <span className="text-xs">👘</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-medium">
                            {item.fabric}
                          </span>
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-2 py-1 rounded-full font-medium">
                            {item.color}
                          </span>
                        </div>
                        <p className="text-base font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white/70 rounded-full px-2 py-1 shadow-sm">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center text-gray-700 font-bold transition-all text-sm"
                          >
                            -
                          </button>
                          <span className="text-base font-bold text-gray-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 flex items-center justify-center text-green-700 font-bold transition-all text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="text-right">
                        <p className="text-xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent font-playfair mb-1">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-96">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden sticky top-24"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                }}
              >
                <div className="bg-gradient-to-r from-amber-600 to-green-600 p-6 text-white">
                  <h3 className="text-xl font-playfair font-bold mb-1 text-white">Order Summary</h3>
                  <p className="text-amber-50 text-sm">Review your purchase</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Items ({getTotalItems()})</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Delivery</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                        ₹{getTotalPrice().toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={ordering}
                      className="w-full text-white py-4 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-xl"
                      style={{
                        background: ordering 
                          ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                          : 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #b45309)',
                        boxShadow: ordering 
                          ? 'none' 
                          : '0 10px 25px -5px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(251, 191, 36, 0.2)',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {ordering ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">⏳</span>
                          Processing...
                        </span>
                      ) : (
                        `💳 Proceed to Checkout`
                      )}
                    </button>

                    {/* Continue Shopping */}
                    <div className="mt-6 text-center">
                      <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-800 font-light transition-colors"
                      >
                        ← Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
