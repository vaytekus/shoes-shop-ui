'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/info/about', label: 'Про Магазин' },
  { href: '/info/delivery', label: 'Доставка та Оплата' },
  { href: '/info/returns', label: 'Повернення та Обмін' },
  { href: '/info/contacts', label: 'Контакти' },
]

export default function InfoSidebar() {
  const pathname = usePathname()

  return (
    <div>
      <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 mb-1">
        Інформація
      </div>
      <nav className="flex flex-col">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm transition-colors border-l-2 ${
              pathname === link.href
                ? 'border-gray-900 text-gray-900 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
