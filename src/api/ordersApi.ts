import client from './client'
import type { Order, DeliveryType, PaymentMethod } from '@/types'

export interface CheckoutOrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
  size: string
}

export interface CreateOrderRequest {
  firstName: string
  lastName: string
  phone: string
  email: string
  deliveryType: DeliveryType
  paymentMethod: PaymentMethod
  shippingAddress: {
    street: string
    city: string
    country: string
    zipCode: string
  }
  items: CheckoutOrderItem[]
}

export const getOrders = () =>
  client.get<Order[]>('/api/orders')

export const getOrder = (id: string) =>
  client.get<Order>(`/api/orders/${id}`)

export const getCustomerOrders = (customerId: string, page = 1, pageSize = 20) =>
  client.get<{ items: Order[]; totalCount: number }>(`/api/orders/customer/${customerId}?page=${page}&pageSize=${pageSize}`)

export const createOrder = (order: CreateOrderRequest) =>
  client.post<{ id: string }>('/api/orders', order)
