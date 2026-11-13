'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const id = params.get('id')

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-4xl mb-6">✓</div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-3">Замовлення оформлено</h1>
      <p className="text-gray-500 text-sm mb-8">
        Ми отримали ваше замовлення і незабаром звʼяжемося з вами.
      </p>
      {id && (
        <div className="mb-6">
          <Link
            href={`/orders/${id}`}
            className="text-sm text-gray-900 underline"
          >
            Переглянути замовлення #{id.slice(0, 8)}
          </Link>
        </div>
      )}
      <Link
        href="/products"
        className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors"
      >
        До каталогу
      </Link>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
