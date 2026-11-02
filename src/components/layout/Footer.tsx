import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Shoes Shop</h3>
          <p className="text-sm">Магазин якісного взуття</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Інформація</h3>
          <ul className="text-sm space-y-2">
            <li><Link href="/info/about" className="hover:text-white transition-colors">Про магазин</Link></li>
            <li><Link href="/info/delivery" className="hover:text-white transition-colors">Доставка та оплата</Link></li>
            <li><Link href="/info/returns" className="hover:text-white transition-colors">Повернення та обмін</Link></li>
            <li><Link href="/info/contacts" className="hover:text-white transition-colors">Контакти</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Контакти</h3>
          <p className="text-sm">Пн–Пт: 10:00–19:00</p>
          <p className="text-sm mt-1">info@shoes-shop.ua</p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs">
        © 2026 Shoes Shop
      </div>
    </footer>
  )
}
