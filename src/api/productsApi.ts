import client from './client'
import type { Product } from '@/types'

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export const getProducts = (page = 1, pageSize = 12, categoryId?: string) => {
  const params = new URLSearchParams({page: String(page), pageSize: String(pageSize) })

  if(categoryId){
    params.append('categoryId', categoryId)
  }

  return client.get<PagedResult<Product>>(`/api/products?${params}`)
}

export const getProduct = (id: string) => 
  client.get<Product>(`/api/products/${id}`)