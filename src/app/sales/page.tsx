'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProducts } from '@/api/productsApi'
import ProductCard from '@/components/products/ProductCard'

export default function SalesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')

  const { data, isLoading } = useQuery({
    queryKey: ['products-sales', page],
    queryFn: () => getProducts(page, 12, undefined, undefined, true).then(r => r.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Акції</h1>
      <p className="text-sm text-gray-400 mb-8">Товари зі знижкою</p>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Акційних товарів немає</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => router.push(`/sales?page=${page - 1}`)} disabled={page === 1} className="px-4 py-2 text-sm border rounded disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <span className="px-4 py-2 text-sm text-gray-600">{page} / {data.totalPages}</span>
              <button onClick={() => router.push(`/sales?page=${page + 1}`)} disabled={page === data.totalPages} className="px-4 py-2 text-sm border rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
