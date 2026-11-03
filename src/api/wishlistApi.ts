import client from './client'
import type { Wishlist, WishlistItem } from '@/types'

export const getWishlist = (customerId: string) =>
  client.get<Wishlist>(`/api/wishlist/${customerId}`).then(r => r.data)

export const addToWishlist = (customerId: string, item: WishlistItem) =>
  client.post<Wishlist>(`/api/wishlist/${customerId}/items`, item).then(r => r.data)

export const removeFromWishlist = (customerId: string, productId: string) =>
  client.delete(`/api/wishlist/${customerId}/items/${productId}`)

export const mergeWishlist = (customerId: string, items: WishlistItem[]) =>
  client.post<Wishlist>(`/api/wishlist/${customerId}/merge`, { items }).then(r => r.data)
