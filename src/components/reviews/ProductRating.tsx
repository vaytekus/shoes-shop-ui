'use client'

import { useQuery } from '@tanstack/react-query'
import { getProductReviews } from '@/api/reviewsApi'
import StarRating from './StarRating'

interface ProductRatingProps {
  productId: string
}

export default function ProductRating({ productId }: ProductRatingProps) {
  const { data } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId).then(r => r.data),
  })

  if (!data || data.totalCount === 0) return null

  return (
    <div className="flex items-center gap-2 mb-3">
      <StarRating value={Math.round(data.averageRating)} size={16} />
      <span className="text-sm text-gray-500">{data.averageRating} ({data.totalCount})</span>
    </div>
  )
}
