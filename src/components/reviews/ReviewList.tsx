'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getProductReviews, createReview } from '@/api/reviewsApi'
import StarRating from './StarRating'

interface ReviewListProps {
  productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated())

  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { data } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId).then(r => r.data),
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => createReview(productId, { rating, text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      setSubmitted(true)
      setRating(0)
      setText('')
    },
  })

  const reviews = data?.reviews ?? []
  const avg = data?.averageRating ?? 0
  const total = data?.totalCount ?? 0

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Відгуки</h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">Поки що немає відгуків.</p>
      ) : (
        <div className="space-y-5 mb-8">
          {reviews.map(r => (
            <div key={r.id} className="border-b border-gray-100 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <StarRating value={r.rating} size={14} />
                <span className="text-sm font-medium text-gray-900">{r.customerName}</span>
                <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('uk-UA')}</span>
              </div>
              <p className="text-sm text-gray-700">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {submitted && (
        <p className="text-sm text-green-600">Дякуємо! Ваш відгук надіслано на модерацію.</p>
      )}

      {isAuthenticated && !submitted && (
        <div className="border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Залишити відгук</p>
          <div className="mb-3">
            <StarRating value={rating} onChange={setRating} size={24} />
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ваш відгук..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:border-gray-400"
          />
          {isError && (
            <p className="text-xs text-red-500 mt-1">
              {(error as { response?: { data?: { title?: string } } })?.response?.data?.title ?? 'Помилка. Можливо, ви вже залишали відгук.'}
            </p>
          )}
          <button
            disabled={rating === 0 || text.trim() === '' || isPending}
            onClick={() => mutate()}
            className="mt-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Збереження...' : 'Надіслати'}
          </button>
        </div>
      )}
    </div>
  )
}
