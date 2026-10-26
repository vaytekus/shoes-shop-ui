'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getProduct } from '@/api/productsApi'
import { addItem, getBasket } from '@/api/basketApi'
import { useCustomerId } from '@/hooks/useCustomerId'
import type { ProductVariant, ProductSize } from '@/types'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = useCustomerId()
  const queryClient = useQueryClient()

  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null)
  const [activeSize, setActiveSize] = useState<ProductSize | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id).then(r => r.data),
  })

  useEffect(() => {
    if (!product) return
    const variantId = searchParams.get('variant')
    const found = variantId ? product.variants.find(v => v.id === variantId) : null
    setActiveVariant(found ?? product.variants[0] ?? null)
  }, [product])

  const currentVariant = activeVariant ?? product?.variants?.[0] ?? null
  const currentImages = currentVariant?.imageUrls ?? []

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
      imageUrl: currentImages[0] ?? '',
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
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden mb-3">
            {currentImages[activeImage] ? (
              <img src={currentImages[activeImage]} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">👟</div>
            )}
          </div>
          {currentImages.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {currentImages.map((url, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-gray-900' : 'border-transparent'}`}>
                  <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.categoryName && <p className="text-sm text-gray-400 mb-1">{product.categoryName}</p>}
          {product.brand && <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {[product.brand, currentVariant?.name].filter(Boolean).join(' ')}
          </h1>
          {product.discountPercent ? (
            <div className="flex items-center gap-3 mb-4">
              <p className="text-2xl font-semibold text-red-600">
                ${(product.price * (1 - product.discountPercent / 100)).toFixed(0)}
              </p>
              <p className="text-lg text-gray-400 line-through">${product.price}</p>
              <span className="text-sm bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded">-{product.discountPercent}%</span>
            </div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Color: {currentVariant?.colorName}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map(v => (
                  <button key={v.id}
                    onClick={() => {
                      setActiveVariant(v)
                      setActiveImage(0)
                      setActiveSize(null)
                      router.replace(`?variant=${v.id}`, { scroll: false })
                    }}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${currentVariant?.id === v.id ? 'border-gray-900' : 'border-gray-200'}`}>
                    {v.imageUrls[0] ? (
                      <img src={v.imageUrls[0]} alt={v.colorName ?? v.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: v.colorHex ?? '#e5e7eb' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {currentVariant && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Size (EU)</p>
              <div className="flex gap-2 flex-wrap">
                {currentVariant.sizes.map(s => (
                  <button key={s.id}
                    disabled={s.stockQuantity === 0}
                    onClick={() => setActiveSize(s)}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      s.stockQuantity === 0
                        ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                        : activeSize?.id === s.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-900'
                    }`}>
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isInBasket || added ? (
            <Link href="/basket" className="w-full bg-green-600 text-white py-3 rounded-lg text-sm text-center block hover:bg-green-700 transition-colors">
              Go to basket
            </Link>
          ) : (
            <button
              disabled={!activeSize || isPending}
              onClick={() => customerId && mutate()}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? 'Adding...' : activeSize ? 'Add to basket' : 'Select size'}
            </button>
          )}

          {/* Characteristics */}
          {[
            { label: 'Матеріал верху', value: product.upperMaterial },
            { label: 'Підкладка', value: product.liningMaterial },
            { label: 'Устілка', value: product.insoleMaterial },
            { label: 'Підошва', value: product.soleMaterial },
            { label: 'Повнота', value: product.width },
            { label: 'Сезон', value: product.season },
            { label: 'Висота каблука', value: product.heelHeight },
            { label: 'Призначення', value: product.purpose },
            { label: 'Стиль', value: product.style },
            { label: 'Країна бренду', value: product.brandCountry },
            { label: 'Країна виробництва', value: product.manufactureCountry },
          ].some(r => r.value) && (
            <div className="mt-6 border border-gray-100 rounded-lg overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-2 bg-gray-50">Характеристики</p>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Матеріал верху', value: product.upperMaterial },
                  { label: 'Підкладка', value: product.liningMaterial },
                  { label: 'Устілка', value: product.insoleMaterial },
                  { label: 'Підошва', value: product.soleMaterial },
                  { label: 'Повнота', value: product.width },
                  { label: 'Сезон', value: product.season },
                  { label: 'Висота каблука', value: product.heelHeight },
                  { label: 'Призначення', value: product.purpose },
                  { label: 'Стиль', value: product.style },
                  { label: 'Країна бренду', value: product.brandCountry },
                  { label: 'Країна виробництва', value: product.manufactureCountry },
                ].filter(r => r.value).map(r => (
                  <div key={r.label} className="flex px-4 py-2 text-sm">
                    <span className="text-gray-400 w-40 shrink-0">{r.label}</span>
                    <span className="text-gray-900">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
