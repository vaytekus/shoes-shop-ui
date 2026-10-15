'use client'

import Link from 'next/link'
import { ShoppingCart, User, Heart } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { getBasket } from '@/api/basketApi'
import { useCustomerId } from '@/hooks/useCustomerId'
import { logoutRequest } from '@/api/authApi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from './Logo'

export const navItems = [
  {
    label: 'Жіноче взуття',
    href: '/products/women',
    emoji: '👠',
    items: ["Балетки", "Босоніжки", "В'єтнамки", "Кеди", "Кросівки", "Лофери", "Мокасини", "Мюлі", "Оксфорди", "Слінгбеки", "Сліпони", "Туфлі", "Туфлі перфорація", "Туфлі човники", "Уггі", "Челсі", "Черевики", "Черевики ковбойки", "Чоботи", "Шльопанці"],
  },
  {
    label: 'Чоловіче взуття',
    href: '/products/men',
    emoji: '👞',
    items: ["Кросівки", "Черевики", "Туфлі", "Лофери", "Мокасини", "Кеди", "Сліпони", "Уггі", "Челсі", "Шльопанці"],
  },
  { label: 'Сумки', href: '/products/bags', emoji: '👜', items: ["Клатчі", "Рюкзаки", "Шопери", "Крос-боді", "Тоут-беги"] },
  { label: 'Аксесуари', href: '/products/accessories', emoji: '🎀', items: ["Ремені", "Гаманці", "Шкарпетки", "Шнурки"] },
  { label: 'Догляд', href: '/products/care', emoji: '✨', items: ["Засоби догляду", "Устілки", "Колодки"] },
]

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const clearAccessToken = useAuthStore(state => state.clearAccessToken)
  const customerId = useCustomerId()
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const { data: basket } = useQuery({
    queryKey: ['basket', customerId],
    queryFn: () => getBasket(customerId!).then(r => r.data).catch(err => {
      if (err.response?.status === 404) return null
      throw err
    }),
    enabled: !!customerId,
  })

  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const handleLogout = async () => {
    await logoutRequest()
    clearAccessToken()
    setProfileOpen(false)
    router.push('/')
  }

  const authenticated = isAuthenticated()

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setActiveNav(item.label)}
              onMouseLeave={() => setActiveNav(null)}
            >
              <Link
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-5"
              >
                {item.label}
              </Link>

              {activeNav === item.label && item.items.length > 0 && (
                <div className="absolute left-0 top-full bg-white border border-gray-100 shadow-lg rounded-b-lg w-52 py-2 z-50">
                  {item.items.map(sub => (
                    <Link
                      key={sub}
                      href={`${item.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Heart className="w-5 h-5" />
          </Link>

          <Link href="/basket" className="relative text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {authenticated ? (
            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full bg-white border border-gray-100 rounded shadow-md w-44 py-1 z-20">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Профіль
                  </Link>
                  <Link href="/profile/password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Змінити пароль
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Вийти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
