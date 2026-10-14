'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Edit Profile', href: '/profile' },
  { label: 'Change Password', href: '/profile/password' },
  { label: 'My Orders', href: '/profile/orders', disabled: true },
  { label: 'Wishlist', href: '/profile/wishlist', disabled: true },
  { label: 'Addresses', href: '/profile/addresses', disabled: true },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const accessToken = useAuthStore(state => state.accessToken)
  const isInitialized = useAuthStore(state => state.isInitialized)
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !accessToken) router.push('/login')
  }, [isInitialized, accessToken])

  if (!isInitialized || !accessToken) return null

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 flex gap-10">
      <aside className="w-48 shrink-0">
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            item.disabled ? (
              <span
                key={item.href}
                className="px-3 py-2 rounded text-sm text-gray-300 cursor-not-allowed"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
