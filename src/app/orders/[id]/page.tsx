'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { getOrder } from '@/api/ordersApi'
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

const DELIVERY_LABELS = { NovaPoshta: 'Нова Пошта', UkrPoshta: 'Укрпошта', Pickup: 'Самовивіз' }
const PAYMENT_LABELS = { CashOnDelivery: 'При отриманні на пошті', CashInStore: 'При отриманні в магазині', Online: 'Онлайн' }

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id).then(r => r.data),
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Завантаження...</div>
  if (isError || !order) return <div className="text-center py-20 text-gray-400">Замовлення не знайдено</div>

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Назад
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Замовлення #{order.id.slice(0, 8)}</h1>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${STATUS_CLASS[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* contact info + delivery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="border border-gray-100 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Контактні дані</p>
          <p className="text-sm text-gray-900">{order.firstName} {order.lastName}</p>
          <p className="text-sm text-gray-600">{order.phone}</p>
          <p className="text-sm text-gray-600">{order.email}</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Доставка</p>
          <p className="text-sm text-gray-900">{DELIVERY_LABELS[order.deliveryType]}</p>
          {order.deliveryType !== 'Pickup' && (
            <p className="text-sm text-gray-600 mt-1">
              {order.shippingAddress.city}, {order.shippingAddress.street}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">{PAYMENT_LABELS[order.paymentMethod]}</p>
        </div>
      </div>

      {/* items */}
      <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-5 py-3 bg-gray-50">Товари</p>
        {order.items.map(item => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4 px-5 py-4 border-t border-gray-100">
            <Link href={`/products/item/${item.productId}`} className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                : <div className="w-full h-full flex items-center justify-center text-gray-200 text-2xl">👟</div>
              }
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
              {item.size && <p className="text-xs text-gray-500 mt-0.5">Розмір: {item.size}</p>}
              <p className="text-xs text-gray-500 mt-0.5">× {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* total */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="text-lg font-semibold text-gray-900">Разом: ${order.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  )
}
