'use client'

import Link from 'next/link'
import { ShoppingCart, User, Heart, Search } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { getBasket } from '@/api/basketApi'
import { useCustomerId } from '@/hooks/useCustomerId'
import { logoutRequest } from '@/api/authApi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'

export const navItems = [
  {
    label: 'Жіноче взуття',
    href: '/search?section=women',
    emoji: '👠',
    items: [
      { label: "Балетки", slug: "ballet-flats" },
      { label: "Босоніжки", slug: "sandals" },
      { label: "В'єтнамки", slug: "flip-flops" },
      { label: "Кеди", slug: "sneakers" },
      { label: "Кросівки", slug: "running-shoes" },
      { label: "Лофери", slug: "loafers" },
      { label: "Мокасини", slug: "moccasins" },
      { label: "Мюлі", slug: "mules" },
      { label: "Оксфорди", slug: "oxfords" },
      { label: "Слінгбеки", slug: "slingbacks" },
      { label: "Сліпони", slug: "slip-ons" },
      { label: "Туфлі", slug: "heels" },
      { label: "Туфлі перфорація", slug: "perforated-heels" },
      { label: "Туфлі човники", slug: "pumps" },
      { label: "Уггі", slug: "uggs" },
      { label: "Челсі", slug: "chelsea" },
      { label: "Черевики", slug: "boots" },
      { label: "Черевики ковбойки", slug: "cowboy-boots" },
      { label: "Чоботи", slug: "tall-boots" },
      { label: "Шльопанці", slug: "slides" },
    ],
  },
  {
    label: 'Чоловіче взуття',
    href: '/search?section=men',
    emoji: '👞',
    items: [
      { label: "Кросівки", slug: "sneakers" },
      { label: "Черевики", slug: "boots" },
      { label: "Туфлі", slug: "dress-shoes" },
      { label: "Лофери", slug: "loafers" },
      { label: "Мокасини", slug: "moccasins" },
      { label: "Кеди", slug: "canvas-sneakers" },
      { label: "Сліпони", slug: "slip-ons" },
      { label: "Уггі", slug: "uggs" },
      { label: "Челсі", slug: "chelsea" },
      { label: "Шльопанці", slug: "slides" },
    ],
  },
  {
    label: 'Сумки',
    href: '/search?section=bags',
    emoji: '👜',
    items: [
      { label: "Клатчі", slug: "clutches" },
      { label: "Рюкзаки", slug: "backpacks" },
      { label: "Шопери", slug: "shoppers" },
      { label: "Крос-боді", slug: "crossbody" },
      { label: "Тоут-беги", slug: "tote-bags" },
    ],
  },
  {
    label: 'Аксесуари',
    href: '/search?section=accessories',
    emoji: '🎀',
    items: [
      { label: "Ремені", slug: "belts" },
      { label: "Гаманці", slug: "wallets" },
      { label: "Шкарпетки", slug: "socks" },
      { label: "Шнурки", slug: "laces" },
    ],
  },
  {
    label: 'Догляд',
    href: '/search?section=care',
    emoji: '✨',
    items: [
      { label: "Засоби догляду", slug: "care-products" },
      { label: "Устілки", slug: "insoles" },
      { label: "Колодки", slug: "shoe-trees" },
    ],
  },
]

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const clearAccessToken = useAuthStore(state => state.clearAccessToken)
  const customerId = useCustomerId()
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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
    <>
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
                      key={sub.slug}
                      href={`${item.href}/${sub.slug}`}
                      className="block px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setSearchOpen(true)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

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

    {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
  </>
  )
}
