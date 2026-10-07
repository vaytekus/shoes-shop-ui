import client from './client'
import type { Basket, BasketItem } from '@/types'

export const getBasket = (customerId: string) =>
  client.get<Basket>(`/api/basket/${customerId}`)

export const addItem = (customerId: string, item: Omit<BasketItem, 'quantity'> & { quantity: number }) =>
  client.post(`/api/basket/${customerId}/items`, item)

export const removeItem = (customerId: string, productId: string) =>
  client.delete(`/api/basket/${customerId}/items/${productId}`)

export const updateItem = (customerId: string, productId: string, item: Omit<BasketItem, 'quantity'> & { quantity: number }) =>
  client.put(`/api/basket/${customerId}/items/${productId}`, item)

export const clearBasket = (customerId: string) =>
  client.delete(`/api/basket/${customerId}`)
