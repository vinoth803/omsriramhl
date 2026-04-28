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
    <div className="min-h-screen bg-saree-pattern">
      {/* Header */}
      <header className="glass-saree border-b" style={{ borderColor: 'rgba(240, 249, 240, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-playfair font-bold" style={{ color: '#2d5016' }}>
              OmSaiRam HandLooms
            </Link>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-saree rounded-xl p-8 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          
          <h1 className="text-3xl font-bold mb-4 font-playfair" style={{ color: '#2d5016' }}>
            Order Placed Successfully!
          </h1>
          
          <p className="mb-8" style={{ color: '#3e5622' }}>
            Thank you for your purchase. Your order has been confirmed and payment has been processed.
          </p>

          {orderId && trackingId && (
            <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '2px solid #d4c5a9' }}>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold" style={{ color: '#2d5016' }}>Order ID: </span>
                  <span className="text-green-600 font-mono">{orderId}</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: '#2d5016' }}>Tracking ID: </span>
                  <span className="text-green-600 font-mono">{trackingId}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-left rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#2d5016' }}>What's Next?</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#3e5622' }}>
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
                  className="px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                  style={{
                    background: 'linear-gradient(135deg, #2d5016 0%, #3e5622 100%)',
                    color: 'white'
                  }}
                >
                  Track Your Order
                </Link>
              )}
              
              <button
                onClick={shareOnWhatsApp}
                className="px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #25d366 0%, #20b954 100%)',
                  color: 'white'
                }}
              >
                <span>📱</span>
                <span>Share on WhatsApp</span>
              </button>
              
              <Link
                href="/"
                className="px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
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

          {/* Contact Info */}
          <div className="mt-8 pt-6 text-sm" style={{ borderTop: '1px solid rgba(212, 197, 169, 0.5)', color: '#3e5622' }}>
            <p>Questions about your order?</p>
            <p className="font-semibold" style={{ color: '#2d5016' }}>WhatsApp us at: +91 9876543210</p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="glass-saree rounded-xl p-8 mt-8">
          <h2 className="text-xl font-bold mb-6 font-playfair" style={{ color: '#2d5016' }}>Order Process</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" 
                   style={{ background: 'linear-gradient(135deg, #25d366 0%, #20b954 100%)' }}>
                ✓
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#2d5016' }}>Order Confirmed</div>
                <div className="text-sm" style={{ color: '#3e5622' }}>Your payment has been processed successfully</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                   style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                2
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#2d5016' }}>Processing</div>
                <div className="text-sm" style={{ color: '#3e5622' }}>We're preparing your items for shipment</div>
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
