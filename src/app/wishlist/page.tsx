'use client'

import Link from 'next/link'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCustomerId } from '@/hooks/useCustomerId'
import { useAuthStore } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addItem } from '@/api/basketApi'
import type { WishlistItem } from '@/types'

function WishlistCard({ item }: { item: WishlistItem }) {
  const customerId = useCustomerId()
  const authCustomerId = useAuthStore(state => state.customerId)
  const queryClient = useQueryClient()
  const { toggle } = useWishlistStore()

  const productUrl = `/products/${item.section || 'all'}/${item.categoryName?.toLowerCase() || 'all'}/${item.productId}`

  const { mutate, isPending } = useMutation({
    mutationFn: () => addItem(customerId!, {
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      categoryName: item.categoryName ?? ''
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['basket'] })
  })

  return (
    <div className="flex gap-5 py-6 border-b border-gray-100">
      <Link href={productUrl} className="w-36 h-36 rounded-lg overflow-hidden shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl">👟</div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={productUrl} className="text-sm font-medium text-gray-900 hover:underline truncate block">
          {item.productName}
        </Link>
        <p className="text-sm font-bold text-gray-900 mt-1">${item.price}</p>
        <div className="flex gap-2 mt-3">
          <button
            disabled={!customerId || isPending}
            onClick={() => customerId && mutate()}
            className="text-xs border border-gray-900 text-gray-900 px-3 py-1.5 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Adding...' : 'Add to basket'}
          </button>
          <button
            onClick={() => toggle(item, authCustomerId)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function WishlistSummary({ items }: { items: WishlistItem[] }) {
  const customerId = useCustomerId()
  const queryClient = useQueryClient()
  const total = items.reduce((sum, i) => sum + i.price, 0)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      for (const item of items) {
        await addItem(customerId!, {
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl,
          categoryName: item.categoryName ?? ''
        })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['basket'] })
  })

  return (
    <div className="border border-gray-100 rounded-xl p-6 h-fit sticky top-24">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Підсумок</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Товарів</span>
          <span>{items.length}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-100 pt-2">
          <span>Разом</span>
          <span>${total}</span>
        </div>
      </div>
      <button
        disabled={!customerId || isPending}
        onClick={() => customerId && mutate()}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-4 h-4" />
        {isPending ? 'Додаємо...' : 'Додати все до кошика'}
      </button>
      <Link
        href="/basket"
        className="mt-3 w-full block text-center text-sm border border-gray-200 text-gray-600 py-3 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors"
      >
        Перейти до кошика
      </Link>
    </div>
  )
}

export default function WishlistPage() {
  const { items } = useWishlistStore()

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Вішліст порожній</h1>
        <p className="text-sm text-gray-400 mb-6">Додавайте товари натискаючи на серце</p>
        <Link href="/products" className="text-sm border border-gray-900 px-4 py-2 hover:bg-gray-900 hover:text-white transition-colors">
          Перейти до каталогу
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Вішліст ({items.length})</h1>
      <div className="flex gap-10 items-start">
        <div className="flex-1">
          {items.map(item => (
            <WishlistCard key={item.productId} item={item} />
          ))}
        </div>
        <div className="w-72 shrink-0">
          <WishlistSummary items={items} />
        </div>
      </div>
    </div>
  )
}
