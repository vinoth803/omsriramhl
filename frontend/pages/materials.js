import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCart } from '../context/CartContext'
import CartIcon from '../components/CartIcon'
import axios from 'axios'
import { 
  MATERIALS_CONFIG, 
  getAllCategories, 
  getCategory, 
  getCategorySubcategories,
  getSubcategory,
  getCategoryPath 
} from '../config/materialsConfig'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function Materials() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('sarees')
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('name') // name, price-low, price-high

  useEffect(() => {
    // Set initial selection based on URL query or default
    const { category, subcategory } = router.query
    if (category && MATERIALS_CONFIG[category]) {
      setSelectedCategory(category)
      if (subcategory) {
        setSelectedSubcategory(subcategory)
      }
    }
    fetchProducts()
  }, [router.query])

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', `${API_URL}/api/products`)
      const response = await axios.get(`${API_URL}/api/products`)
      console.log('Products received:', response.data)
      setProducts(response.data)
      filterProducts(response.data, selectedCategory, selectedSubcategory)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = (productsData, category, subcategory) => {
    let filtered = productsData
    console.log('Filtering products:', { productsData: productsData?.length, category, subcategory })
    // For demo, showing all products - you can add filtering logic here
    setFilteredProducts(filtered)
    console.log('Filtered products set:', filtered?.length)
  }

  const handleCategorySelect = (categoryId, subcategoryId = null) => {
    console.log('Category selected:', { categoryId, subcategoryId, productsLength: products.length })
    setSelectedCategory(categoryId)
    setSelectedSubcategory(subcategoryId)
    setSidebarOpen(false) // Close sidebar on mobile
    
    // Filter products when category changes
    filterProducts(products, categoryId, subcategoryId)
    
    // Update URL without page reload
    const query = { category: categoryId }
    if (subcategoryId) {
      query.subcategory = subcategoryId
    }
    router.push({ pathname: '/materials', query }, undefined, { shallow: true })
  }

  const getCurrentData = () => {
    const category = getCategory(selectedCategory)
    if (!category) return null

    if (selectedSubcategory) {
      return getSubcategory(selectedCategory, selectedSubcategory)
    }
    return category
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    // You can replace this with a toast notification
    alert('Added to cart!')
  }

  const sortProducts = (products, sortBy) => {
    const sorted = [...products]
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }

  const currentData = getCurrentData()
  const categories = getAllCategories()
  const sortedProducts = sortProducts(filteredProducts, sortBy)

  return (
    <>
      <Head>
        <title>Materials Collection - OmSaiRam HandLooms</title>
        <meta name="description" content="Explore our premium collection of sarees, chudidar materials, and handwoven fabrics" />
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
                  <p className="text-xs text-gray-500 font-medium">PREMIUM MATERIALS</p>
                </div>
              </Link>
              
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                  Collection
                </Link>
                <Link href="/materials" className="text-amber-700 hover:text-amber-900 font-medium transition-colors border-b-2 border-amber-500 px-3 py-2">
                  Materials
                </Link>
                <Link href="/track" className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2">
                  Track Order
                </Link>
                <CartIcon />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Professional Sidebar */}
            <div className={`
              fixed md:static top-16 left-0 h-full md:h-auto z-40
              w-80 md:w-72 bg-gradient-to-br from-gray-50 to-gray-100 md:bg-transparent p-6 md:p-0
              transform md:transform-none transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              shadow-2xl md:shadow-none
            `}>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden backdrop-blur-sm"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                }}
              >
                {/* Sidebar Header - TESTING STRONG CONTRAST */}
                <div 
                  className="bg-amber-700 bg-gradient-to-r from-amber-600 to-green-600 p-6" 
                  style={{ 
                    backgroundColor: '#7c2d12 !important', // Very dark fallback
                    backgroundImage: 'linear-gradient(to right, #92400e, #047857)',
                    minHeight: '80px'
                  }}
                >
                  <h2 className="text-lg font-playfair font-bold mb-1 text-white" style={{ color: '#ffffff !important', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Browse Collection</h2>
                  <p className="text-white text-sm font-light" style={{ color: '#ffffff !important', opacity: '0.95', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Handpicked premium materials</p>
                </div>

                {/* Filter Section */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'name', label: 'Name A-Z' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          sortBy === option.value
                            ? 'bg-amber-100 text-amber-800 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="border-b border-gray-50 last:border-b-0">
                      {/* Main Category */}
                      <button
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left p-4 transition-all duration-200 ${
                          selectedCategory === category.id && !selectedSubcategory
                            ? 'bg-gradient-to-r from-amber-50 to-green-50 border-r-4 border-amber-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{category.name}</div>
                              <div className="text-xs text-gray-500">{category.description}</div>
                            </div>
                          </div>
                          {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                            <div className={`w-2 h-2 rounded-full bg-gray-400 transition-all duration-200 ${
                              selectedCategory === category.id ? 'bg-amber-500' : ''
                            }`}></div>
                          )}
                        </div>
                      </button>

                      {/* Subcategories */}
                      {selectedCategory === category.id && category.subcategories && Object.keys(category.subcategories).length > 0 && (
                        <div className="bg-gray-50">
                          {getCategorySubcategories(category.id).map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => handleCategorySelect(category.id, subcategory.id)}
                              className={`w-full text-left px-6 py-3 ml-8 border-l-2 transition-all ${
                                selectedSubcategory === subcategory.id
                                  ? 'border-amber-500 bg-white shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{subcategory.icon}</span>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{subcategory.name}</div>
                                  <div className="text-xs text-gray-500">{subcategory.description}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact CTA */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-amber-50">
                  <button
                    onClick={() => {
                      const message = encodeURIComponent("Hi! I'm interested in your premium materials collection.")
                      window.open(`https://wa.me/919876543210?text=${message}`, '_blank')
                    }}
                    className="w-full text-white py-2 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    💬 Chat with Expert
                  </button>
                </div>
              </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {currentData && (
                <>
                  {/* Professional Header Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden mb-8"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <div className="relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-green-600/10"></div>
                      <div className="relative px-8 py-12 text-center">
                        <div className="text-6xl mb-4">{currentData.icon}</div>
                        <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">{currentData.name}</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 font-light">
                          {currentData.description}
                        </p>
                        
                        {/* Elegant Breadcrumb */}
                        <div className="flex justify-center items-center space-x-3 text-sm">
                          <span className="px-3 py-1 bg-white/80 rounded-full text-gray-600 font-light">Materials</span>
                          <span className="text-gray-400 font-bold">•</span>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                            {getCategory(selectedCategory)?.name}
                          </span>
                          {selectedSubcategory && (
                            <>
                              <span className="text-gray-400 font-bold">•</span>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                {currentData.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">
                        {loading ? 'Loading...' : `${sortedProducts.length} products`}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'list' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Products Grid/List */}
                  {loading ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-gradient-to-r from-amber-600 to-green-600 transition ease-in-out duration-150">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading premium materials...
                      </div>
                    </div>
                  ) : sortedProducts.length > 0 ? (
                    <div className={
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                    }>
                      {sortedProducts.map((product) => (
                        <div key={product.id} 
                          className={`group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-sm ${
                            viewMode === 'list' ? 'flex items-center p-4' : ''
                          }`}
                          style={{
                            boxShadow: viewMode === 'grid' 
                              ? '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                              : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          {viewMode === 'grid' ? (
                            <>
                              {/* Grid View */}
                              <div className="relative aspect-square overflow-hidden">
                                <img
                                  src={`${API_URL}/sarees/${product.image}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                                <div 
                                  className="absolute inset-0 bg-gradient-to-br from-amber-200 to-green-300 flex items-center justify-center" 
                                  style={{display: 'none'}}
                                >
                                  <span className="text-6xl">👘</span>
                                </div>
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <p className="font-semibold text-sm">{product.fabric}</p>
                                    <p className="text-xs opacity-90">{product.color}</p>
                                  </div>
                                </div>

                                {/* Quick Action Button */}
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="absolute top-4 right-4 bg-gradient-to-br from-white/90 to-gray-100/90 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl transform hover:scale-110 border border-white/50"
                                  title="Add to Cart"
                                  style={{
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                                  }}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                                  </svg>
                                </button>
                              </div>

                              <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 px-2 py-1 rounded-full font-medium">
                                    {product.fabric}
                                  </span>
                                  <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 px-2 py-1 rounded-full font-medium">
                                    {product.color}
                                  </span>
                                </div>
                                
                                <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2 line-clamp-1">
                                  {product.name}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed font-light">
                                  {product.description}
                                </p>
                                
                                <div className="flex items-center justify-between mb-4">
                                  <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                                    ₹{product.price.toLocaleString()}
                                  </div>
                                </div>
                                
                                {/* Thin Tube Button Bar */}
                                <div className="flex rounded-full overflow-hidden border border-gray-300 shadow-md">
                                  <Link 
                                    href={`/product/${product.id}`}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 text-xs font-semibold text-center transition-all duration-200 border-r border-gray-300"
                                  >
                                    Details
                                  </Link>
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="flex-1 bg-gradient-to-r from-amber-200 to-green-200 hover:from-amber-300 hover:to-green-300 text-gray-900 py-2 px-4 text-xs font-semibold text-center transition-all duration-200"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* List View */}
                              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 mr-4">
                                <img
                                  src={`${API_URL}/sarees/${product.image}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                                <div 
                                  className="w-full h-full bg-gradient-to-br from-amber-200 to-green-300 flex items-center justify-center" 
                                  style={{display: 'none'}}
                                >
                                  <span className="text-2xl">👘</span>
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 mr-4">
                                    <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-1 font-light">{product.description}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-medium">
                                        {product.fabric}
                                      </span>
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                                        {product.color}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent mb-3">
                                      ₹{product.price.toLocaleString()}
                                    </div>
                                    
                                    {/* Thin Tube Button Bar for List View */}
                                    <div className="flex rounded-full overflow-hidden border border-gray-300 shadow-md w-40">
                                      <Link 
                                        href={`/product/${product.id}`}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-1 px-3 text-xs font-semibold text-center transition-all duration-200 border-r border-gray-300"
                                      >
                                        View
                                      </Link>
                                      <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-gradient-to-r from-amber-200 to-green-200 hover:from-amber-300 hover:to-green-300 text-gray-900 py-1 px-3 text-xs font-semibold text-center transition-all duration-200"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-8xl mb-6">🎨</div>
                      <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                        Curating {currentData.name} Collection
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto font-light">
                        Our artisans are handpicking the finest {currentData.name.toLowerCase()} for you. 
                        Check back soon for our latest additions.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            const message = encodeURIComponent(`Hi! I'm interested in ${currentData.name}. When will new items be available?`)
                            window.open(`https://wa.me/919876543210?text=${message}`, '_blank')
                          }}
                          className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 hover:shadow-2xl shadow-xl"
                          style={{
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          💬 Get Notified
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
