'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/api/categoriesApi'
import { getBasket } from '@/api/basketApi'
import { useCustomerId } from '@/hooks/useCustomerId'
import Logo from './Logo'

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const customerId = useCustomerId()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  })

  const { data: basket } = useQuery({
    queryKey: ['basket', customerId],
    queryFn: () => getBasket(customerId!).then(r => r.data).catch(err => {
      if (err.response?.status === 404) return null
      throw err
    }),
    enabled: !!customerId,
  })

  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

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
              href={`/products/${cat.name.toLowerCase()}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/basket" className="relative text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href={isAuthenticated() ? '/orders' : '/login'} className="text-gray-600 hover:text-gray-900 transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
