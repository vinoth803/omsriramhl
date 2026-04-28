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
    
    // Add to cart with specified quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
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
      key: "rzp_test_Sj1qqe8BTgyBDw", // Your Razorpay test key
      amount: order.amount,
      currency: "INR",
      name: "OmSaiRam HandLooms",
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #48bb78', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#718096' }}>Loading saree...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '16px' }}>Saree Not Found</h1>
          <p style={{ color: '#718096' }}>The saree you're looking for doesn't exist.</p>
          <Link
            href="/"
            style={{
              marginTop: '16px',
              display: 'inline-block',
              backgroundColor: '#48bb78',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Back to Saree Collection
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

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
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>�</span>
            </div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c' }}>Saree Details</h1>
          </div>
          <CartIcon />
        </div>
      </div>

      {/* Product Details */}
      <div style={{ maxWidth: '28rem', margin: '16px auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        {/* Saree Image */}
        <div style={{ width: '100%', height: '400px', position: 'relative', background: 'linear-gradient(to bottom right, #fbb6ce, #d6bcfa)' }}>
          <img 
            src={`http://localhost:5001/sarees/${product.image}`}
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
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
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <span style={{ fontSize: '6rem' }}>�</span>
          </div>
        </div>
        
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>{product.name}</h2>
          <p style={{ color: '#718096', marginBottom: '16px' }}>{product.description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d53f8c' }}>
              ₹{product.price.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#a0aec0' }}>per saree</span>
          </div>

          {/* Quantity Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '8px' }}>
              Quantity
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid #cbd5e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', width: '48px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid #cbd5e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>Total:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d53f8c' }}>
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: addingToCart ? 'not-allowed' : 'pointer',
                backgroundColor: addingToCart ? '#a0aec0' : '#4299e1',
                color: 'white',
                transition: 'background-color 0.15s ease-in-out'
              }}
            >
              {addingToCart ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ marginRight: '8px' }}>⏳</span>
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
              style={{
                width: '100%',
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
                `💳 Buy Now - ₹${totalPrice.toLocaleString()}`
              )}
            </button>
          </div>

          {/* View Cart Link */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link
              href="/cart"
              style={{ color: '#2d5016', fontWeight: '500', textDecoration: 'none' }}
            >
              View Cart & Checkout
            </Link>
          </div>

          {/* WhatsApp Info */}
          {ref && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fff4', borderRadius: '8px', border: '1px solid #9ae6b4' }}>
              <p style={{ fontSize: '0.875rem', color: '#276749', textAlign: 'center' }}>
                📱 Order from WhatsApp • Ref: {ref}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '0 16px 24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🔒</div>
            <p style={{ fontSize: '0.75rem', color: '#718096' }}>Secure Payment</p>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🚚</div>
            <p style={{ fontSize: '0.75rem', color: '#718096' }}>Fast Delivery</p>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>💯</div>
            <p style={{ fontSize: '0.75rem', color: '#718096' }}>Authentic Sarees</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
