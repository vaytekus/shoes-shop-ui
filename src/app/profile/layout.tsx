'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Редагувати профіль', href: '/profile' },
  { label: 'Змінити пароль', href: '/profile/password' },
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
    <div className="flex-1 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 flex gap-10">
        <aside className="w-64 shrink-0">
          <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 mb-1">
            Акаунт
          </div>
          <nav className="flex flex-col">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm transition-colors border-l-2 ${
                  pathname === item.href
                    ? 'border-gray-900 text-gray-900 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
