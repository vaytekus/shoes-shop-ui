'use client'

import Link from 'next/link'
import { ShoppingCart, User, Heart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/api/categoriesApi'
import Logo from './Logo'

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  })

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            All Products
          </Link>
          {categories?.slice(0, 4).map(cat => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/basket" className="text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <Link href={isAuthenticated() ? '/orders' : '/login'} className="text-gray-600 hover:text-gray-900 transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
