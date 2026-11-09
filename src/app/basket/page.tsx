'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCustomerId } from '@/hooks/useCustomerId'
import { getBasket, updateItem, removeItem, clearBasket } from '@/api/basketApi'

export default function BasketPage() {
  const customerId = useCustomerId()
  const queryClient = useQueryClient()

  const { data: basket, isLoading } = useQuery({
    queryKey: ['basket', customerId],
    queryFn: () => getBasket(customerId!).then(r => r.data).catch(err => {
      if (err.response?.status === 404) return null
      throw err
    }),
    enabled: !!customerId,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['basket'] })

  const { mutate: updateQty } = useMutation({
    mutationFn: ({ productId, productName, price, imageUrl, categoryName, size, quantity }: {
      productId: string, productName: string, price: number, imageUrl: string, categoryName: string, size: string, quantity: number
    }) => updateItem(customerId!, productId, { productId, productName, price, imageUrl, categoryName, size, quantity }),
    onSuccess: invalidate,
  })

  const { mutate: remove } = useMutation({
    mutationFn: ({ productId, size }: { productId: string, size: string }) =>
      removeItem(customerId!, productId, size),
    onSuccess: invalidate,
  })

  const { mutate: clear } = useMutation({
    mutationFn: () => clearBasket(customerId!),
    onSuccess: () => queryClient.setQueryData(['basket', customerId], null),
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  if (!basket || basket.items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-6">Кошик порожній</p>
        <Link href="/products" className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors">
          До каталогу
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Кошик ({basket.items.length})</h1>
        <button
          onClick={() => clear()}
          className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
        >
          Очистити
        </button>
      </div>

      <div className="flex gap-10 items-start">
        <div className="flex-1">
          {basket.items.map(item => (
            <div key={item.productId} className="flex gap-5 py-6 border-b border-gray-100">
              <Link href={`/products/item/${item.productId}`} className="w-36 h-36 rounded-lg overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl">👟</div>
                )}
              </Link>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/products/item/${item.productId}`} className="text-sm font-medium text-gray-900 hover:underline truncate">
                      {item.productName}
                    </Link>
                    <button
                      onClick={() => remove({ productId: item.productId, size: item.size })}
                      className="text-gray-300 hover:text-gray-900 transition-colors text-lg leading-none shrink-0"
                    >
                      ×
                    </button>
                  </div>
                  {item.size && <p className="text-sm text-gray-500 mt-1">Розмір: <span className="font-medium text-gray-900">{item.size}</span></p>}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => item.quantity === 1 ? remove({ productId: item.productId, size: item.size }) : updateQty({ ...item, quantity: item.quantity - 1 })}
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

        <div className="w-72 shrink-0">
          <div className="border border-gray-100 rounded-xl p-6 sticky top-24">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Підсумок</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Товарів</span>
                <span>{basket.items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-100 pt-2">
                <span>Разом</span>
                <span>${basket.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors"
            >
              Оформити замовлення
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
