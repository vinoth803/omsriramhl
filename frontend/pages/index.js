import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useCart } from '../context/CartContext'
import CartIcon from '../components/CartIcon'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    alert('Product added to cart!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>OmSaiRam HandLooms - Traditional Saree Collection</title>
        <meta name="description" content="Discover our beautiful collection of traditional and modern sarees at OmSaiRam HandLooms" />
      </Head>
      <div className="min-h-screen bg-saree-pattern">
        {/* Modern Header with Glass Effect */}
        <header className="glass-saree sticky top-0 z-50 border-b border-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <h1 className="text-3xl font-playfair font-bold" style={{ color: '#2d5016' }}>
                OmSaiRam HandLooms
              </h1>
              <div className="flex items-center space-x-6">
                <Link 
                  href="/track" 
                  className="font-medium transition-colors"
                  style={{ color: '#2d5016' }}
                >
                  Track Order
                </Link>
                <CartIcon />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-4" style={{ color: '#2d5016' }}>
              Saree Collection
            </h2>
            <p className="text-xl max-w-2xl mx-auto font-light" style={{ color: '#3e5622' }}>
              Discover our beautiful collection of traditional and modern sarees, 
              handcrafted with love and tradition
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-green-400 px-6 py-2 rounded-full text-sm font-semibold shadow-lg" style={{ color: '#2d5016' }}>
                ✨ New Arrivals Every Week
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="card-product scale-in hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full h-80 overflow-hidden">
                <img 
                  src={`${API_URL}/sarees/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center" 
                  style={{display: 'none'}}
                >
                  <span className="text-6xl">👘</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-medium">
                    {product.fabric}
                  </span>
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-medium">
                    {product.color}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold gradient-text font-playfair">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/product/${product.id}`}
                      className="btn btn-primary text-sm px-4 py-2"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-saree text-sm px-4 py-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl" style={{ color: '#2d5016' }}>No products available at the moment.</p>
            <p className="text-sm mt-2" style={{ color: '#3e5622' }}>Please start the backend server to see products.</p>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="glass-saree border-t mt-16" style={{ borderColor: 'rgba(240, 249, 240, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-playfair font-bold mb-4" style={{ color: '#2d5016' }}>
              OmSaiRam HandLooms
            </h3>
            <p className="mb-6 max-w-md mx-auto" style={{ color: '#3e5622' }}>
              Preserving tradition, crafting elegance. Every saree tells a story of heritage and artistry.
            </p>
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <p className="text-sm" style={{ color: '#5a6c2d' }}>Premium Quality</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚚</div>
                <p className="text-sm" style={{ color: '#5a6c2d' }}>Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💝</div>
                <p className="text-sm" style={{ color: '#5a6c2d' }}>Gift Wrapping</p>
              </div>
            </div>
            <div className="border-t pt-6" style={{ borderColor: 'rgba(240, 249, 240, 0.3)' }}>
              <p className="text-sm" style={{ color: '#5a6c2d' }}>
                &copy; 2024 OmSaiRam HandLooms. All rights reserved.
              </p>
              <p className="text-sm mt-2" style={{ color: '#5a6c2d' }}>
                📱 Order via WhatsApp for quick delivery and personal assistance!
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
