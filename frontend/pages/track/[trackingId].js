import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function TrackOrder() {
  const router = useRouter()
  const { trackingId } = router.query
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (trackingId) {
      fetchOrderStatus()
    }
  }, [trackingId])

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/track/${trackingId}`)
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Order not found or tracking ID is invalid')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅'
      case 'processing': return '⏳'
      case 'shipped': return '🚚'
      case 'delivered': return '📦'
      default: return '⭕'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600'
      case 'processing': return 'text-yellow-600'
      case 'shipped': return 'text-blue-600'
      case 'delivered': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const shareOrderStatus = () => {
    if (!order) return

    const message = `📦 Order Status Update\n\nTracking ID: ${trackingId}\nStatus: ${order.status.toUpperCase()}\nOrder Total: ₹${order.total}\n\nItems:\n${order.items.map((item, index) => 
      `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n')}\n\nThank you for shopping with us!`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-saree-pattern flex items-center justify-center">
        <div className="glass-saree rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#2d5016' }}></div>
          <div className="text-xl" style={{ color: '#2d5016' }}>Loading order details...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-saree-pattern">
      {/* Header */}
      <header className="glass-saree border-b" style={{ borderColor: 'rgba(240, 249, 240, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-playfair font-bold" style={{ color: '#2d5016' }}>
              OmSaiRam HandLooms
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/track" className="font-medium transition-colors hover:scale-105" style={{ color: '#2d5016' }}>
                Track Another Order
              </Link>
              <Link href="/cart" className="font-medium transition-colors hover:scale-105" style={{ color: '#2d5016' }}>
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          /* Error State */
          <div className="glass-saree rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4 font-playfair" style={{ color: '#2d5016' }}>Order Not Found</h1>
            <p className="mb-6" style={{ color: '#3e5622' }}>{error}</p>
            <div className="space-y-4">
              <Link
                href="/track"
                className="inline-block px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #2d5016 0%, #3e5622 100%)',
                  color: 'white'
                }}
              >
                Try Another Tracking ID
              </Link>
              <div className="text-center">
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I'm having trouble tracking my order with ID: ${trackingId} from OmSaiRam HandLooms. Can you help me?`)
                    const whatsappUrl = `https://wa.me/919876543210?text=${message}`
                    window.open(whatsappUrl, '_blank')
                  }}
                  className="inline-block px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #25d366 0%, #20b954 100%)',
                    color: 'white'
                  }}
                >
                  Get Help on WhatsApp
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Order Found */
          <>
            {/* Order Header */}
            <div className="glass-saree rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold font-playfair" style={{ color: '#2d5016' }}>Order Tracking</h1>
                  <p style={{ color: '#3e5622' }}>Tracking ID: <span className="font-mono font-semibold">{trackingId}</span></p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </div>
                  <p className="text-sm" style={{ color: '#3e5622' }}>Order #{order.orderId}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="glass-saree rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-6 font-playfair" style={{ color: '#2d5016' }}>Order Status Timeline</h2>
              <div className="space-y-6">
                {[
                  { status: 'confirmed', label: 'Order Confirmed', description: 'Your order has been received and confirmed' },
                  { status: 'processing', label: 'Processing', description: 'We are preparing your items for shipment' },
                  { status: 'shipped', label: 'Shipped', description: 'Your order is on its way to you' },
                  { status: 'delivered', label: 'Delivered', description: 'Your order has been delivered successfully' }
                ].map((step, index) => {
                  const isCompleted = ['confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
                  const isCurrent = ['confirmed', 'processing', 'shipped', 'delivered'][index] === order.status
                  
                  return (
                    <div key={step.status} className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? isCurrent 
                            ? 'text-white shadow-lg' 
                            : 'text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      style={isCompleted 
                        ? (isCurrent 
                          ? { background: 'linear-gradient(135deg, #2d5016 0%, #3e5622 100%)' }
                          : { background: 'linear-gradient(135deg, #25d366 0%, #20b954 100%)' })
                        : {}
                      }>
                        {isCompleted ? (isCurrent ? index + 1 : '✓') : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${isCompleted ? '' : 'text-gray-400'}`}
                             style={isCompleted ? { color: '#2d5016' } : {}}>
                          {step.label}
                        </div>
                        <div className={`text-sm ${isCompleted ? '' : 'text-gray-400'}`}
                             style={isCompleted ? { color: '#3e5622' } : {}}>
                          {step.description}
                        </div>
                        {isCurrent && (
                          <div className="text-sm font-semibold mt-1" style={{ color: '#2d5016' }}>
                            Current Status
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Customer Information */}
              <div className="glass-saree rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 font-playfair" style={{ color: '#2d5016' }}>Delivery Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold" style={{ color: '#2d5016' }}>Name: </span>
                    <span style={{ color: '#3e5622' }}>{order.customer.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: '#2d5016' }}>Phone: </span>
                    <span style={{ color: '#3e5622' }}>{order.customer.phone}</span>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: '#2d5016' }}>Address: </span>
                    <span style={{ color: '#3e5622' }}>{order.customer.address}</span>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: '#2d5016' }}>Order Date: </span>
                    <span style={{ color: '#3e5622' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass-saree rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 font-playfair" style={{ color: '#2d5016' }}>Order Summary</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-semibold" style={{ color: '#2d5016' }}>{item.name}</div>
                        <div style={{ color: '#3e5622' }}>₹{item.price} × {item.quantity}</div>
                      </div>
                      <div className="font-semibold" style={{ color: '#2d5016' }}>₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                  <div className="border-t pt-3" style={{ borderColor: 'rgba(212, 197, 169, 0.5)' }}>
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span style={{ color: '#2d5016' }}>Total</span>
                      <span className="text-green-600">₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="glass-saree rounded-xl p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={shareOrderStatus}
                  className="flex-1 py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  style={{
                    background: 'linear-gradient(135deg, #25d366 0%, #20b954 100%)',
                    color: 'white'
                  }}
                >
                  <span>📱</span>
                  <span>Share Status on WhatsApp</span>
                </button>
                
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I have a question about my order ${trackingId} from OmSaiRam HandLooms. Current status: ${order.status}`)
                    const whatsappUrl = `https://wa.me/919876543210?text=${message}`
                    window.open(whatsappUrl, '_blank')
                  }}
                  className="flex-1 py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  style={{
                    background: 'linear-gradient(135deg, #2d5016 0%, #3e5622 100%)',
                    color: 'white'
                  }}
                >
                  <span>💬</span>
                  <span>Contact Support</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 py-3 px-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d5016',
                    border: '2px solid #d4c5a9'
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
