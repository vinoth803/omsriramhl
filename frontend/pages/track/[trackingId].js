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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading order details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              WhatsApp Store
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/track" className="text-blue-600 hover:text-blue-800">
                Track Another Order
              </Link>
              <Link href="/cart" className="text-blue-600 hover:text-blue-800">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          /* Error State */
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-4">
              <Link
                href="/track"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Another Tracking ID
              </Link>
              <div className="text-center">
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I'm having trouble tracking my order with ID: ${trackingId}. Can you help me?`)
                    const whatsappUrl = `https://wa.me/919876543210?text=${message}`
                    window.open(whatsappUrl, '_blank')
                  }}
                  className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
                  <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{trackingId}</span></p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl ${getStatusColor(order.status)} font-bold`}>
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-600">Order #{order.orderId}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Timeline</h2>
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? (isCurrent ? index + 1 : '✓') : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </div>
                        <div className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </div>
                        {isCurrent && (
                          <div className="text-sm text-blue-600 font-semibold mt-1">
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Name: </span>
                    <span className="text-gray-900">{order.customer.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Phone: </span>
                    <span className="text-gray-900">{order.customer.phone}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Address: </span>
                    <span className="text-gray-900">{order.customer.address}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Order Date: </span>
                    <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-gray-600">₹{item.price} × {item.quantity}</div>
                      </div>
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={shareOrderStatus}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📱</span>
                  <span>Share Status on WhatsApp</span>
                </button>
                
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I have a question about my order ${trackingId}. Current status: ${order.status}`)
                    const whatsappUrl = `https://wa.me/919876543210?text=${message}`
                    window.open(whatsappUrl, '_blank')
                  }}
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>💬</span>
                  <span>Contact Support</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center"
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
