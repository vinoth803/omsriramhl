import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function CartIcon() {
  const { getCartCount } = useCart()
  const count = getCartCount()

  return (
    <Link href="/cart" className="relative">
      <div className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M17 13v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8.5" 
          />
        </svg>
        <span>Cart</span>
        {count > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {count > 99 ? '99+' : count}
          </div>
        )}
      </div>
    </Link>
  )
}
