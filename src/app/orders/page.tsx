'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { getCustomerOrders } from '@/api/ordersApi'
import type { Order } from '@/types'

const STATUS_LABELS: Record<Order['status'], string> = {
  Pending: 'Нове',
  Processing: 'В обробці',
  Shipped: 'Відправлено',
  Delivered: 'Доставлено',
  Cancelled: 'Скасовано',
}

const STATUS_CLASS: Record<Order['status'], string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const router = useRouter()
  const customerId = useAuthStore(s => s.customerId)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated())

  const { data, isLoading } = useQuery({
    queryKey: ['customer-orders', customerId],
    queryFn: () => getCustomerOrders(customerId!).then(r => r.data),
    enabled: !!customerId,
  })

  if (!isAuthenticated) {
    router.replace('/login?from=/orders')
    return null
  }

  if (isLoading) return <div className="text-center py-20 text-gray-400">Завантаження...</div>

  const orders = data?.items ?? []

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-6">Замовлень ще немає</p>
        <Link href="/products" className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors">
          До каталогу
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Мої замовлення</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} href={`/orders/${order.id}`}
            className="block border border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8)}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${STATUS_CLASS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {order.items.length} {order.items.length === 1 ? 'товар' : 'товари'}
              </p>
              <p className="text-sm font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
