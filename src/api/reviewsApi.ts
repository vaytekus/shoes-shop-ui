import client from './client'
import type { ProductReviewResult } from '@/types'

export const getProductReviews = (productId: string) =>
  client.get<ProductReviewResult>(`/api/products/${productId}/reviews`)

export const createReview = (productId: string, data: { rating: number; text: string }) =>
  client.post(`/api/products/${productId}/reviews`, data)
