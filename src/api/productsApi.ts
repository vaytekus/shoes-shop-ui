import client from './client'
import type { Product } from '@/types'

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export const getProducts = (page = 1, pageSize = 12) => 
  client.get<PagedResult<Product>>(`/api/products?page=${page}&pageSize=${pageSize}`)

export const getProduct = (id: string) => 
  client.get<Product>(`/api/products/${id}`)