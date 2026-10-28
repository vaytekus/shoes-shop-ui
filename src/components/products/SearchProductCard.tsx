'use client'

import { useRouter } from 'next/navigation'
import type { SearchProductDocument } from '@/types'

interface Props {
  product: SearchProductDocument
}

export default function SearchProductCard({ product }: Props) {
  const router = useRouter()
  const section = product.section?.toLowerCase() ?? 'all'
  const category = product.categoryName?.toLowerCase() ?? 'all'
  const url = `/products/${section}/${category}/${product.id}`

  const salePrice = product.discountPercent
    ? (product.price! * (1 - product.discountPercent / 100)).toFixed(0)
    : null

  return (
    <div
      className="group flex flex-col cursor-pointer"
      onClick={() => router.push(url)}
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-3">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl">👟</div>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
      {salePrice ? (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-bold text-red-600">${salePrice}</p>
          <p className="text-xs text-gray-400 line-through">${product.price}</p>
          <span className="text-xs text-red-500 font-medium">-{product.discountPercent}%</span>
        </div>
      ) : (
        <p className="text-sm font-bold text-gray-900 mt-1">${product.price}</p>
      )}
    </div>
  )
}
