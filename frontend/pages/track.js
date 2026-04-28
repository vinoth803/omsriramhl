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
    <div className="min-h-screen bg-saree-pattern">
      {/* Header */}
      <header className="glass-saree border-b" style={{ borderColor: 'rgba(240, 249, 240, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-playfair font-bold" style={{ color: '#2d5016' }}>
              OmSaiRam HandLooms
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/materials" className="font-medium transition-colors hover:scale-105" style={{ color: '#2d5016' }}>
                Materials
              </Link>
              <Link href="/cart" className="font-medium transition-colors hover:scale-105" style={{ color: '#2d5016' }}>
                Cart
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Track Order Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-saree rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">📦</div>
            <h1 className="text-3xl font-playfair font-bold mb-2" style={{ color: '#2d5016' }}>Track Your Order</h1>
            <p style={{ color: '#3e5622' }}>Enter your tracking ID to see the current status of your order</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trackingId" className="block text-sm font-medium mb-2" style={{ color: '#2d5016' }}>
                Tracking ID
              </label>
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g., TRK123456789)"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-lg transition-all duration-300"
                style={{ 
                  borderColor: '#d4c5a9',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#2d5016'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2d5016'
                  e.target.style.boxShadow = '0 0 0 3px rgba(45, 80, 22, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d4c5a9'
                  e.target.style.boxShadow = 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #2d5016 0%, #3e5622 100%)',
                color: 'white'
              }}
            >
              Track Order
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(212, 197, 169, 0.5)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d5016' }}>Need Help?</h3>
            <div className="space-y-3 text-sm" style={{ color: '#3e5622' }}>
              <div className="flex items-start space-x-2">
                <span>📱</span>
                <div>
                  <p className="font-semibold" style={{ color: '#2d5016' }}>WhatsApp Support</p>
                  <p>Message us at +91 9876543210 for immediate assistance</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span>🆔</span>
                <div>
                  <p className="font-semibold" style={{ color: '#2d5016' }}>Tracking ID Format</p>
                  <p>Your tracking ID starts with 'TRK' followed by numbers (e.g., TRK123456789)</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span>📧</span>
                <div>
                  <p className="font-semibold" style={{ color: '#2d5016' }}>Order Confirmation</p>
                  <p>Check your WhatsApp messages for the tracking ID sent after purchase</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  const message = encodeURIComponent("Hi! I need help tracking my order from OmSaiRam HandLooms. Can you please assist me?")
                  const whatsappUrl = `https://wa.me/919876543210?text=${message}`
                  window.open(whatsappUrl, '_blank')
                }}
                className="w-full py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #25d366 0%, #20b954 100%)',
                  color: 'white'
                }}
              >
                <span>📱</span>
                <span>Get Help on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Tracking IDs for Demo */}
        <div className="glass-saree rounded-lg p-6 mt-8" style={{ borderLeft: '4px solid #d4c5a9' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#2d5016' }}>Demo Tracking IDs</h3>
          <p className="text-sm mb-3" style={{ color: '#3e5622' }}>Try these sample tracking IDs to see the tracking system in action:</p>
          <div className="space-y-2">
            {['TRK123456789', 'TRK987654321', 'TRK555666777'].map((id) => (
              <button
                key={id}
                onClick={() => setTrackingId(id)}
                className="block w-full text-left rounded px-3 py-2 text-sm transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #d4c5a9',
                  color: '#2d5016'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(212, 197, 169, 0.2)'
                  e.target.style.borderColor = '#2d5016'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                  e.target.style.borderColor = '#d4c5a9'
                }}
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
