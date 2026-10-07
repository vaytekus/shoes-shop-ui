'use client'

import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCustomerId } from '@/hooks/useCustomerId'
import { getBasket, updateItem, removeItem, clearBasket } from '@/api/basketApi'

export default function BasketPage() {
  const customerId = useCustomerId()
  const queryClient = useQueryClient()

  const { data: basket, isLoading } = useQuery({
    queryKey: ['basket', customerId],
    queryFn: () => getBasket(customerId!).then(r => r.data)
    .catch(err => {
      if(err.response?.status === 404) return null
      throw err
    }),
    enabled: !!customerId,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['basket'] })

  const { mutate: updateQty } = useMutation({
    mutationFn: ({ productId, productName, price, imageUrl, categoryName, quantity }: {
      productId: string, productName: string, price: number, imageUrl: string, categoryName: string, quantity: number
    }) => updateItem(customerId!, productId, { productId, productName, price, imageUrl, categoryName, quantity }),
    onSuccess: invalidate,
  })

  const { mutate: remove } = useMutation({
    mutationFn: (productId: string) => removeItem(customerId!, productId),
    onSuccess: invalidate,
  })

  const { mutate: clear } = useMutation({
    mutationFn: () => clearBasket(customerId!),
    onSuccess: () => queryClient.setQueryData(['basket', customerId], null),
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  if (!basket || basket.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-6">Your basket is empty</p>
        <Link href="/products" className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Basket</h1>
        <button
          onClick={() => clear()}
          className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {basket.items.map(item => (
          <div key={item.productId} className="flex gap-4 py-6">
            <Link href={`/products/${item.categoryName || 'all'}/${item.productId}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl">👟</div>
              )}
            </Link>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <Link href={`/products/${item.categoryName || 'all'}/${item.productId}`} className="text-sm font-medium text-gray-900 hover:underline">
                  {item.productName}
                </Link>
                <button
                  onClick={() => remove(item.productId)}
                  className="text-gray-300 hover:text-gray-900 transition-colors ml-4 text-lg leading-none"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        remove(item.productId)
                      } else {
                        updateQty({ ...item, quantity: item.quantity - 1 })
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty({ ...item, quantity: item.quantity + 1 })}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-6 mt-2">
        <div className="flex items-center justify-between mb-6">
          <p className="text-base text-gray-600">Total</p>
          <p className="text-xl font-bold text-gray-900">${basket.totalPrice.toFixed(2)}</p>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-gray-900 text-white text-center py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  )
}
