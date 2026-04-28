import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import CartIcon from "../../components/CartIcon";

export default function ProductPage() {
  const router = useRouter();
  const { id, ref, phone } = router.query;
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/product/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setAddingToCart(true);
    addToCart(product, quantity);
    
    // Show success feedback
    setTimeout(() => {
      setAddingToCart(false);
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
    }, 300);
  };

  const buyNow = async () => {
    if (!product) return;
    
    setOrdering(true);
    
    try {
      // Create order
      const orderResponse = await axios.post("http://localhost:5001/api/create-order", {
        productId: id,
        quantity: quantity,
        ref: ref || "unknown"
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
      key: "rzp_test_1234567890", // Replace with your Razorpay key
      amount: order.amount,
      currency: "INR",
      name: "Your Store Name",
      description: `${product.name} x ${quantity}`,
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
            
            // Redirect back to WhatsApp with tracking ID
            redirectToWhatsApp(trackingId);
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
      prefill: {
        contact: phone || ""
      },
      theme: {
        color: "#25D366"
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

  const redirectToWhatsApp = (trackingId) => {
    const message = encodeURIComponent(
      `✅ Order Confirmed!\n\n📦 Product: ${product.name}\n🔢 Quantity: ${quantity}\n🆔 Tracking ID: ${trackingId}\n\nThank you for your order! We'll process it shortly.`
    );
    
    const whatsappUrl = phone 
      ? `https://wa.me/${phone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    
    window.location.href = whatsappUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">🛒</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Product Details</h1>
          </div>
          <CartIcon />
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-md mx-auto bg-white m-4 rounded-lg shadow-sm overflow-hidden">
        {/* Product Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-6xl">📱</span>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">per item</span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                addingToCart
                  ? 'bg-blue-400 cursor-not-allowed text-white'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'
              }`}
            >
              {addingToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                `🛒 Add to Cart - ₹${totalPrice.toLocaleString()}`
              )}
            </button>

            {/* Buy Now Button */}
            <button
              onClick={buyNow}
              disabled={ordering}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                ordering
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              }`}
            >
              {ordering ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `💳 Buy Now - ₹${totalPrice.toLocaleString()}`
              )}
            </button>
          </div>

          {/* View Cart Link */}
          <div className="mt-4 text-center">
            <Link
              href="/cart"
              className="text-blue-600 font-medium hover:underline"
            >
              View Cart & Checkout
            </Link>
          </div>

          {/* WhatsApp Info */}
          {ref && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 text-center">
                📱 Order from WhatsApp • Ref: {ref}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <div className="flex justify-center space-x-6 text-center">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-600">Secure Payment</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🚚</div>
            <p className="text-xs text-gray-600">Fast Delivery</p>
          </div>
          <div>
            <div className="text-2xl mb-1">💯</div>
            <p className="text-xs text-gray-600">Genuine Products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
