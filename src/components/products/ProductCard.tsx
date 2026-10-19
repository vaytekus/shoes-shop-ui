'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCustomerId } from '@/hooks/useCustomerId'
import { addItem } from '@/api/basketApi'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const customerId = useCustomerId()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const firstVariant = product.variants?.[0]
  const firstImage = firstVariant?.imageUrls?.[0]
  const isInStock = product.variants?.some(v => v.sizes.some(s => s.stockQuantity > 0)) ?? false

  const { mutate, isPending } = useMutation({
    mutationFn: () => addItem(customerId!, {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: firstImage ?? '',
      categoryName: product.categoryName ?? ''
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket'] })
      setAdded(true)
    }
  })

  const productUrl = `/products/${product.gender ?? 'all'}/${product.categoryName?.toLowerCase() ?? 'all'}/${product.id}`

  return (
    <div className="group flex flex-col cursor-pointer" onClick={() => router.push(productUrl)}>
      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl">👟</div>
        )}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs text-gray-400 font-medium">Out of stock</span>
          </div>
        )}
      </div>

      {added ? (
        <Link
          href="/basket"
          onClick={e => e.stopPropagation()}
          className="w-full border border-green-600 bg-green-600 text-white text-xs font-semibold tracking-widest uppercase py-2.5 mb-3 text-center block hover:bg-green-700 transition-colors"
        >
          Go to basket
        </Link>
      ) : (
        <button
          disabled={!isInStock || isPending}
          onClick={e => { e.stopPropagation(); if (customerId) mutate() }}
          className="w-full border border-gray-900 text-gray-900 text-xs font-semibold tracking-widest uppercase py-2.5 mb-3 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isPending ? 'Adding...' : 'Add to basket'}
        </button>
      )}

      <p className="text-xs text-gray-400 mb-1">
        {isInStock ? 'In stock' : 'Out of stock'}
      </p>
      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
      {product.discountPercent ? (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-bold text-red-600">
            ${(product.price * (1 - product.discountPercent / 100)).toFixed(0)}
          </p>
          <p className="text-xs text-gray-400 line-through">${product.price}</p>
          <span className="text-xs text-red-500 font-medium">-{product.discountPercent}%</span>
        </div>
      ) : (
        <p className="text-sm font-bold text-gray-900 mt-1">${product.price}</p>
      )}
    </div>
  )
}
