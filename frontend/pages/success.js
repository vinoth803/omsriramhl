import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Success() {
  const router = useRouter()
  const { orderId, trackingId } = router.query
  const [customerMessage, setCustomerMessage] = useState('')

  useEffect(() => {
    if (orderId && trackingId) {
      // Generate WhatsApp confirmation message
      const message = `🎉 Order Confirmed!\n\nOrder ID: ${orderId}\nTracking ID: ${trackingId}\n\nThank you for your purchase! You can track your order using the tracking ID above.`
      setCustomerMessage(message)
    }
  }, [orderId, trackingId])

  const shareOnWhatsApp = () => {
    const encodedMessage = encodeURIComponent(customerMessage)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
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
          </div>
        </div>
      </header>

      {/* Success Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6">✅</div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and payment has been processed.
          </p>

          {orderId && trackingId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Order ID: </span>
                  <span className="text-green-600 font-mono">{orderId}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tracking ID: </span>
                  <span className="text-green-600 font-mono">{trackingId}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-left bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• You will receive a confirmation message on WhatsApp</li>
                <li>• Your order will be processed within 24 hours</li>
                <li>• We'll send you tracking updates via WhatsApp</li>
                <li>• Estimated delivery: 2-5 business days</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {trackingId && (
                <Link
                  href={`/track/${trackingId}`}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Track Your Order
                </Link>
              )}
              
              <button
                onClick={shareOnWhatsApp}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>📱</span>
                <span>Share on WhatsApp</span>
              </button>
              
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t text-sm text-gray-600">
            <p>Questions about your order?</p>
            <p className="font-semibold">WhatsApp us at: +91 9876543210</p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Process</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-900">Order Confirmed</div>
                <div className="text-sm text-gray-600">Your payment has been processed successfully</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <div className="font-semibold text-gray-900">Processing</div>
                <div className="text-sm text-gray-600">We're preparing your items for shipment</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <div className="font-semibold text-gray-500">Shipped</div>
                <div className="text-sm text-gray-400">Your order is on its way</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                4
              </div>
              <div>
                <div className="font-semibold text-gray-500">Delivered</div>
                <div className="text-sm text-gray-400">Enjoy your purchase!</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
