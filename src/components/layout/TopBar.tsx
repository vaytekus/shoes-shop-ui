'use client'

import Link from 'next/link'
import { Phone, MapPin } from 'lucide-react'
import { useState } from 'react'
import CityModal from './CityModal'

const topLinks = [
  { label: 'Новинки', href: '/new' },
  { label: 'Бренди', href: '/brands' },
  { label: 'Акції', href: '/sales' },
  { label: 'Наші магазини', href: '/stores' },
  { label: 'Доставка та оплата', href: '/delivery' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакти', href: '/contacts' },
]

export default function TopBar() {
  const [cityModalOpen, setCityModalOpen] = useState(false)
  const [city, setCity] = useState('Київ')

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <nav className="flex items-center gap-5">
            {topLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-gray-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href="tel:0800336987" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <Phone className="w-3 h-3" />
              0 800 33 69 87
            </a>
            <button
              onClick={() => setCityModalOpen(true)}
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <MapPin className="w-3 h-3" />
              {city}
            </button>
          </div>
        </div>
      </div>
      <CityModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={(c) => { setCity(c); setCityModalOpen(false) }}
        selected={city}
      />
    </>
  )
}
