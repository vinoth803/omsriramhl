import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Track() {
  const [trackingId, setTrackingId] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (trackingId.trim()) {
      router.push(`/track/${trackingId.trim()}`)
    }
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
            <Link href="/cart" className="text-blue-600 hover:text-blue-800">
              Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Track Order Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">📦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your tracking ID to see the current status of your order</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                Tracking ID
              </label>
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g., TRK123456789)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Track Order
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span>📱</span>
                <div>
                  <p className="font-semibold">WhatsApp Support</p>
                  <p>Message us at +91 9876543210 for immediate assistance</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span>🆔</span>
                <div>
                  <p className="font-semibold">Tracking ID Format</p>
                  <p>Your tracking ID starts with 'TRK' followed by numbers (e.g., TRK123456789)</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span>📧</span>
                <div>
                  <p className="font-semibold">Order Confirmation</p>
                  <p>Check your WhatsApp messages for the tracking ID sent after purchase</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  const message = encodeURIComponent("Hi! I need help tracking my order. Can you please assist me?")
                  const whatsappUrl = `https://wa.me/919876543210?text=${message}`
                  window.open(whatsappUrl, '_blank')
                }}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>📱</span>
                <span>Get Help on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Tracking IDs for Demo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Demo Tracking IDs</h3>
          <p className="text-blue-800 text-sm mb-3">Try these sample tracking IDs to see the tracking system in action:</p>
          <div className="space-y-2">
            {['TRK123456789', 'TRK987654321', 'TRK555666777'].map((id) => (
              <button
                key={id}
                onClick={() => setTrackingId(id)}
                className="block w-full text-left bg-white border border-blue-300 rounded px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
