'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '@/api/productsApi'
import SearchProductCard from '@/components/products/SearchProductCard'
import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import type { FacetItem } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const q        = searchParams.get('q') ?? ''
  const brand    = searchParams.get('brand') ?? ''
  const season   = searchParams.get('season') ?? ''
  const size     = searchParams.get('size') ?? ''
  const purpose  = searchParams.get('purpose') ?? ''
  const category = searchParams.get('category') ?? ''
  const page     = Number(searchParams.get('page') ?? '1')

  const [inputValue, setInputValue] = useState(q)
  useEffect(() => { setInputValue(q) }, [q])

  useEffect(() => {
    const timer = setTimeout(() => {
      setParam('q', inputValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  const { data, isLoading } = useQuery({
    queryKey: ['search', q, brand, season, size, purpose, category, page],
    queryFn: () => searchProducts({ q, brand, season, size, purpose, category, page }).then(r => r.data),
  })

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/search?${p}`)
  }

  const toggleValue = (paramKey: string, current: string, value: string) => {
    const values = current ? current.split(',') : []
    const next = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value]
    setParam(paramKey, next.join(','))
  }

  const isActive = (current: string, value: string) =>
    current.split(',').includes(value)

  const activeFilters = [
    ...brand.split(',').filter(Boolean).map(v => ({ label: v, paramKey: 'brand', value: v })),
    ...season.split(',').filter(Boolean).map(v => ({ label: v, paramKey: 'season', value: v })),
    ...size.split(',').filter(Boolean).map(v => ({ label: `Розмір: ${v}`, paramKey: 'size', value: v })),
    ...purpose.split(',').filter(Boolean).map(v => ({ label: v, paramKey: 'purpose', value: v })),
    ...category.split(',').filter(Boolean).map(v => ({ label: v, paramKey: 'category', value: v })),
  ]

  const FacetList = ({ title, items, paramKey, activeValue }: {
    title: string
    items: FacetItem[]
    paramKey: string
    activeValue: string
  }) => {
    const [open, setOpen] = useState(true)
    return (
      <div className="mb-4 border-b border-gray-100 pb-4">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors"
        >
          {title}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {open && (
          <div className="flex flex-col gap-1 mt-2">
            {items.map(item => (
              <button
                key={item.value}
                onClick={() => toggleValue(paramKey, activeValue, item.value)}
                className={`text-left text-sm px-2 py-1 rounded transition-colors ${
                  isActive(activeValue, item.value)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.value}
                <span className="ml-1 text-xs opacity-60">({item.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const totalPages = data ? Math.ceil(data.total / 20) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 max-w-xl">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Пошук..."
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f, i) => (
            <button
              key={i}
              onClick={() => toggleValue(f.paramKey, searchParams.get(f.paramKey) ?? '', f.value)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {f.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden md:block w-48 shrink-0">
          {!!data?.facets.categories.length && (
            <FacetList title="Категорія" items={data.facets.categories} paramKey="category" activeValue={category} />
          )}
          {!!data?.facets.brands.length && (
            <FacetList title="Бренд" items={data.facets.brands} paramKey="brand" activeValue={brand} />
          )}
          {!!data?.facets.seasons.length && (
            <FacetList title="Сезон" items={data.facets.seasons} paramKey="season" activeValue={season} />
          )}
          {!!data?.facets.sizes.length && (
            <FacetList title="Розмір" items={data.facets.sizes} paramKey="size" activeValue={size} />
          )}
          {!!data?.facets.purposes.length && (
            <FacetList title="Призначення" items={data.facets.purposes} paramKey="purpose" activeValue={purpose} />
          )}
        </aside>

        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-4">
            {isLoading ? 'Пошук...' : `Знайдено: ${data?.total ?? 0}`}
          </p>

          {isLoading ? (
            <div className="text-center py-20 text-gray-300">Завантаження...</div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Нічого не знайдено</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.items.map(product => (
                <SearchProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setParam('page', String(page - 1))} disabled={page === 1} className="px-4 py-2 text-sm border rounded disabled:opacity-40 hover:bg-gray-50">Назад</button>
              <span className="px-4 py-2 text-sm text-gray-600">{page} / {totalPages}</span>
              <button onClick={() => setParam('page', String(page + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm border rounded disabled:opacity-40 hover:bg-gray-50">Далі</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
