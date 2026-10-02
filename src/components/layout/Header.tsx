'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react' 
import { useAuthStore } from '@/store/authStore'

export default function Header(){
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return (
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Shoes Shop
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
              Catalog
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/basket" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </Link>

            <Link href={isAuthenticated() ? '/orders' : '/login'}>
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>
    )
}