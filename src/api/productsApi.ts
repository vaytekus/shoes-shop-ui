import client from './client'
import type { Product, SearchResult } from '@/types'

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export const getProducts = (page = 1, pageSize = 12, categoryId?: string, gender?: string, hasDiscount?: boolean) => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (categoryId) params.append('categoryId', categoryId)
  if (gender && gender !== 'all') params.append('gender', gender)
  if (hasDiscount) params.append('hasDiscount', 'true')
  return client.get<PagedResult<Product>>(`/api/products?${params}`)
}

export const getProduct = (id: string) =>
  client.get<Product>(`/api/products/${id}`)

export interface SearchParams {
  q?: string
  brand?: string
  season?: string
  size?: string
  section?: string
  purpose?: string
  category?: string
  page?: number
  pageSize?: number
}

export const searchProducts = (params: SearchParams) => {
  const p = new URLSearchParams()
  if (params.q)        p.append('q', params.q)
  if (params.brand)    p.append('brand', params.brand)
  if (params.season)   p.append('season', params.season)
  if (params.size)     p.append('size', params.size)
  if (params.section)  p.append('section', params.section)
  if (params.purpose)  p.append('purpose', params.purpose)
  if (params.category) p.append('category', params.category)
  p.append('page', String(params.page ?? 1))
  p.append('pageSize', String(params.pageSize ?? 20))
  return client.get<SearchResult>(`/api/products/search?${p}`)
}