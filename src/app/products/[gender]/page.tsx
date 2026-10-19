'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getProducts } from '@/api/productsApi'
import { getCategories } from '@/api/categoriesApi'
import ProductCard from '@/components/products/ProductCard'

export default function GenderPage() {
  const { gender } = useParams<{ gender: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, gender],
    queryFn: () => getProducts(page, 12, undefined, gender).then(r => r.data),
  })

  const title = gender === 'all' ? 'All Products' : gender.charAt(0).toUpperCase() + gender.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => router.push(`/products/${gender}`)}
          className="px-4 py-1.5 rounded-full text-sm border bg-gray-900 text-white border-gray-900"
        >
          All
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => router.push(`/products/${gender}/${cat.name.toLowerCase()}`)}
            className="px-4 py-1.5 rounded-full text-sm border border-gray-300 text-gray-600 hover:border-gray-900 transition-colors"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => router.push(`/products/${gender}?page=${page - 1}`)} disabled={page === 1} className="px-4 py-2 text-sm border rounded disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <span className="px-4 py-2 text-sm text-gray-600">{page} / {data.totalPages}</span>
              <button onClick={() => router.push(`/products/${gender}?page=${page + 1}`)} disabled={page === data.totalPages} className="px-4 py-2 text-sm border rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
