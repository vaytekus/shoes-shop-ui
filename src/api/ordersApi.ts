import client from './client'
import type { Order, ShippingAddress, BasketItem } from '@/types'

export interface CreateOrderRequest {
  customerId: string,
  shippingAddress: ShippingAddress,
  items: BasketItem[]
}

export const getOrders = () =>
  client.get<Order[]>('/api/orders')

export const getOrder = (id: string) =>
  client.get<Order>(`/api/orders/${id}`)

export const getCustomerOrders = (customerId: string) =>
  client.get<Order[]>(`/api/orders/customer/${customerId}`)

export const createOrder = (order: CreateOrderRequest) =>
  client.post<string>('/api/orders', order)
