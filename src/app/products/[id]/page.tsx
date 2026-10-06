'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { getProduct } from '@/api/productsApi'

export default function ProductPage(){
  const { id } = useParams<{id: string}>()
  const router = useRouter()
  const [activeImage, setActiveImage] = useState(0)

  const {data: product, isLoading, isError} = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id).then(r => r.data)
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

            <button
              disabled={product.stockQuantity === 0}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to basket
            </button>
          </div>
        </div>
      </div>
  )
}