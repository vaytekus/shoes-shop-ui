'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/api/productsApi'
import ProductCard from '@/components/products/ProductCard'

const BRANDS = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Vans', 'Converse', 'Reebok', 'Timberland']

export default function HomePage() {
  const { data: newArrivals } = useQuery({
    queryKey: ['products', 1, 8],
    queryFn: () => getProducts(1, 8).then(r => r.data),
  })

  return (
    <div className="bg-white">
      {/* Hero — тимчасово вимкнено
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Step Into<br />
              <span className="text-gray-400">Style.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              Discover the latest footwear trends. Premium quality, modern design.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-gray-900 px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 text-6xl">
              👟
            </div>
          </div>
        </div>
      </section>
      */}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Жіноче взуття', href: '/products/women', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop&q=80' },
            { label: 'Чоловіче взуття', href: '/products/men', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=80' },
            { label: 'Дитяче взуття', href: '/products/kids', img: 'https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=600&h=800&fit=crop&q=80' },
            { label: 'Сумки', href: '/products/bags', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&q=80' },
          ].map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative overflow-hidden aspect-[3/4] flex items-end bg-gray-100"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              <p className="relative w-full text-center text-sm font-semibold tracking-widest uppercase text-white pb-6">
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {newArrivals && newArrivals.items.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.items.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />  // <- замінено
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-900 py-16 overflow-hidden">
        <p className="text-xs tracking-[0.3em] text-gray-500 uppercase text-center mb-8">Our Brands</p>
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="text-2xl font-bold text-gray-600 hover:text-white transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
