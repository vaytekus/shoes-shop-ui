'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { getProduct } from '@/api/productsApi'
import { addItem, getBasket } from '@/api/basketApi'
import { useCustomerId } from '@/hooks/useCustomerId'

export default function ProductPage(){
  const { id } = useParams<{id: string, category: string}>()
  const router = useRouter()
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const customerId = useCustomerId()
  const queryClient = useQueryClient()

  const {data: product, isLoading, isError} = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id).then(r => r.data)
  })

  const { data: basket } = useQuery({
    queryKey: ['basket', customerId],
    queryFn: () => getBasket(customerId!).then(r => r.data).catch(err => {
      if (err.response?.status === 404) return null
      throw err
    }),
    enabled: !!customerId,
  })

  const isInBasket = basket?.items.some(i => i.productId === id) ?? false

  const { mutate, isPending } = useMutation({
    mutationFn: () => addItem(customerId!, {
      productId: product!.id,
      productName: product!.name,
      price: product!.price,
      quantity: 1,
      imageUrl: product!.imageUrls[0] ?? '',
      categoryName: product!.categoryName ?? ''
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket'] })
      setAdded(true)
    }
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (isError || !product) return <div className="text-center py-20 text-gray-400">Product not found</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-3">
              {product.imageUrls[activeImage] ? (
                <img
                  src={product.imageUrls[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  No image
                </div>
              )}
            </div>

            {product.imageUrls.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-gray-900' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {product.categoryName && (
              <p className="text-sm text-gray-400 mb-2">{product.categoryName}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <p className="text-sm text-gray-400 mb-6">
              {product.stockQuantity > 0 ? `In stock: ${product.stockQuantity}` : 'Out of stock'}
            </p>

            {isInBasket || added ? (
              <Link
                href="/basket"
                className="w-full bg-green-600 text-white py-3 rounded-lg text-sm text-center block hover:bg-green-700 transition-colors"
              >
                Go to basket
              </Link>
            ) : (
              <button
                disabled={product.stockQuantity === 0 || isPending}
                onClick={() => mutate()}
                className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? 'Adding...' : 'Add to basket'}
              </button>
            )}
          </div>
        </div>
      </div>
  )
}
