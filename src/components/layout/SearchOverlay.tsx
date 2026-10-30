'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Search } from 'lucide-react'
import { searchProducts } from '@/api/productsApi'
import type { SearchProductDocument } from '@/types'

interface Props {
  onClose: () => void
}

export default function SearchOverlay({ onClose }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchProductDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); setError(null); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await searchProducts({ q: query, pageSize: 5 })
        setSuggestions(res.data.items)
      } catch (e) {
        console.error('Search overlay error:', e)
        setError('Помилка пошуку')
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onClose()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSuggestionClick = (product: SearchProductDocument) => {
    onClose()
    const section = product.section?.toLowerCase() ?? 'all'
    const category = product.categoryName?.toLowerCase() ?? 'all'
    router.push(`/products/${section}/${category}/${product.id}`)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Пошук взуття, бренду..."
            className="flex-1 px-3 py-1 text-base focus:outline-none"
          />
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </form>

        {suggestions.length > 0 && (
          <ul>
            {suggestions.map(product => (
              <li key={product.id}>
                <button
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-200">👟</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.brand}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">${product.price}</p>
                </button>
              </li>
            ))}
            <li className="border-t border-gray-100">
              <button
                onClick={handleSubmit as never}
                className="w-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 text-left transition-colors"
              >
                Показати всі результати для «{query}»
              </button>
            </li>
          </ul>
        )}

        {loading && (
          <p className="px-4 py-3 text-sm text-gray-400">Пошук...</p>
        )}
        {error && (
          <p className="px-4 py-3 text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
