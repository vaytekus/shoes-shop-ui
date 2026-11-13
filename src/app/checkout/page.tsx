'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useCustomerId } from '@/hooks/useCustomerId'
import { getBasket, clearBasket, removeItem, updateItem } from '@/api/basketApi'
import { getMeRequest } from '@/api/authApi'
import { createOrder } from '@/api/ordersApi'
import type { DeliveryType, PaymentMethod, BasketItem } from '@/types'

const DELIVERY_LABELS: Record<DeliveryType, string> = {
  NovaPoshta: 'Нова Пошта',
  UkrPoshta: 'Укрпошта',
  Pickup: 'Самовивіз',
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CashOnDelivery: 'При отриманні на пошті',
  CashInStore: 'При отриманні в магазині',
  Online: 'Онлайн (незабаром)',
}

const PAYMENT_BY_DELIVERY: Record<DeliveryType, PaymentMethod[]> = {
  NovaPoshta: ['CashOnDelivery', 'Online'],
  UkrPoshta: ['CashOnDelivery', 'Online'],
  Pickup: ['CashInStore', 'Online'],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_DIGITS_RE = /^\d{9}$/

interface AccordionStepProps {
  number: number
  title: string
  summary: string
  isOpen: boolean
  isCompleted: boolean
  isLocked?: boolean
  onEdit: () => void
  children: React.ReactNode
}

function AccordionStep({ number, title, summary, isOpen, isCompleted, isLocked, onEdit, children }: AccordionStepProps) {
  return (
    <div className={`border rounded-xl overflow-hidden ${isLocked ? 'border-gray-100' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
            isCompleted ? 'bg-gray-900 text-white' : isLocked ? 'bg-gray-100 text-gray-300' : 'bg-gray-900 text-white'
          }`}>
            {isCompleted ? '✓' : number}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${isLocked ? 'text-gray-300' : 'text-gray-900'}`}>{title}</p>
            {isCompleted && !isOpen && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{summary}</p>
            )}
          </div>
        </div>
        {isCompleted && !isOpen && (
          <button onClick={onEdit} className="text-xs text-gray-500 hover:text-gray-900 underline shrink-0 ml-4">
            Змінити
          </button>
        )}
      </div>
      {isOpen && !isLocked && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

function FieldError({ msg }: { msg: string }) {
  return <p className="text-xs text-red-500 mt-1">{msg}</p>
}

export default function CheckoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const customerId = useCustomerId()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated())

  const [openStep, setOpenStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [email, setEmail] = useState('')

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('NovaPoshta')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CashOnDelivery')

  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMeRequest().then(r => r.data),
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (!profile) return
    setFirstName(profile.firstName ?? '')
    setLastName(profile.lastName ?? '')
    setEmail(profile.email ?? '')
  }, [profile])

  useEffect(() => {
    if (!isAuthenticated) {
      setFirstName('')
      setLastName('')
      setEmail('')
    }
  }, [isAuthenticated])

  const { data: basket } = useQuery({
    queryKey: ['basket', customerId],
    queryFn: () => getBasket(customerId!).then(r => r.data).catch(() => null),
    enabled: !!customerId,
  })

  useEffect(() => {
    const available = PAYMENT_BY_DELIVERY[deliveryType]
    if (!available.includes(paymentMethod)) setPaymentMethod(available[0])
  }, [deliveryType])

  const { mutate: removeBasketItem } = useMutation({
    mutationFn: ({ productId, size }: { productId: string; size: string }) =>
      removeItem(customerId!, productId, size),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['basket', customerId] }),
  })

  const { mutate: updateBasketItem } = useMutation({
    mutationFn: ({ item, quantity }: { item: BasketItem; quantity: number }) =>
      updateItem(customerId!, item.productId, { ...item, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['basket', customerId] }),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => createOrder({
      firstName,
      lastName,
      phone: `+380${phoneDigits}`,
      email,
      deliveryType,
      paymentMethod,
      shippingAddress: { street, city, country: 'Ukraine', zipCode },
      items: (basket?.items ?? []).map(i => ({
        productId: i.productId,
        productName: i.productName,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
        size: i.size,
      })),
    }),
    onSuccess: async (res) => {
      if (customerId) {
        await clearBasket(customerId)
        queryClient.setQueryData(['basket', customerId], null)
      }
      if (isAuthenticated) {
        router.push(`/orders/${res.data.id}`)
      } else {
        router.push(`/orders/success?id=${res.data.id}`)
      }
    },
  })

  const touch = (field: string) => setTouched(prev => new Set(prev).add(field))

  const errors = {
    firstName: firstName.length > 0 && firstName.length < 2 ? 'Мінімум 2 символи' : '',
    lastName: lastName.length > 0 && lastName.length < 2 ? 'Мінімум 2 символи' : '',
    phone: phoneDigits.length > 0 && !PHONE_DIGITS_RE.test(phoneDigits) ? 'Введіть 9 цифр після +380' : '',
    email: email.length > 0 && !EMAIL_RE.test(email) ? 'Невірний формат email' : '',
    city: city.length > 0 && city.length < 2 ? 'Мінімум 2 символи' : '',
    street: street.length > 0 && street.length < 2 ? 'Мінімум 2 символи' : '',
  }

  const step1Valid = firstName.length >= 2 && lastName.length >= 2
    && PHONE_DIGITS_RE.test(phoneDigits) && EMAIL_RE.test(email)

  const step2Valid = deliveryType === 'Pickup' || (city.length >= 2 && street.length >= 2)

  const completeStep = (step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step))
    setOpenStep(step + 1)
  }

  const allCompleted = completedSteps.has(0) && completedSteps.has(1) && completedSteps.has(2)

  const contactSummary = `${firstName} ${lastName} • +380${phoneDigits} • ${email}`
  const deliverySummary = deliveryType === 'Pickup'
    ? DELIVERY_LABELS[deliveryType]
    : `${DELIVERY_LABELS[deliveryType]}${city ? ` • ${city}` : ''}${street ? `, ${street}` : ''}`
  const paymentSummary = PAYMENT_LABELS[paymentMethod]

  if (!basket || basket.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Кошик порожній</p>
        <button onClick={() => router.push('/products')} className="text-sm text-gray-900 underline">
          До каталогу
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Оформлення замовлення</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-start">

        {/* Left — accordion */}
        <div className="space-y-3">

          {/* Step 1 — contacts */}
          <AccordionStep
            number={1}
            title="Контактні дані"
            summary={contactSummary}
            isOpen={openStep === 0}
            isCompleted={completedSteps.has(0)}
            onEdit={() => setOpenStep(0)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Імʼя</label>
                  <input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    onBlur={() => touch('firstName')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                  {touched.has('firstName') && errors.firstName && <FieldError msg={errors.firstName} />}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Прізвище</label>
                  <input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    onBlur={() => touch('lastName')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                  {touched.has('lastName') && errors.lastName && <FieldError msg={errors.lastName} />}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефон</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500 bg-gray-50">
                    +380
                  </span>
                  <input
                    value={phoneDigits}
                    onChange={e => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    onBlur={() => touch('phone')}
                    placeholder="XXXXXXXXX"
                    className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                {touched.has('phone') && errors.phone && <FieldError msg={errors.phone} />}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => touch('email')}
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
                {touched.has('email') && errors.email && <FieldError msg={errors.email} />}
              </div>
              <button
                disabled={!step1Valid}
                onClick={() => completeStep(0)}
                className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Далі
              </button>
            </div>
          </AccordionStep>

          {/* Step 2 — delivery */}
          <AccordionStep
            number={2}
            title="Доставка"
            summary={deliverySummary}
            isOpen={openStep === 1}
            isCompleted={completedSteps.has(1)}
            isLocked={!completedSteps.has(0)}
            onEdit={() => setOpenStep(1)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(DELIVERY_LABELS) as DeliveryType[]).map(type => (
                  <button key={type} onClick={() => setDeliveryType(type)}
                    className={`py-3 px-2 rounded-lg border text-sm text-center transition-colors ${
                      deliveryType === type ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}>
                    {DELIVERY_LABELS[type]}
                  </button>
                ))}
              </div>

              {deliveryType !== 'Pickup' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Місто</label>
                    <input
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      onBlur={() => touch('city')}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                    {touched.has('city') && errors.city && <FieldError msg={errors.city} />}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Відділення / адреса</label>
                    <input
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      onBlur={() => touch('street')}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                    {touched.has('street') && errors.street && <FieldError msg={errors.street} />}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Індекс</label>
                    <input value={zipCode} onChange={e => setZipCode(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
              )}

              {deliveryType === 'Pickup' && (
                <div className="border border-gray-100 rounded-lg p-4 text-sm text-gray-500">
                  Адреса магазину: вул. Хрещатик 1, Київ
                </div>
              )}

              <button
                disabled={!step2Valid}
                onClick={() => completeStep(1)}
                className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Далі
              </button>
            </div>
          </AccordionStep>

          {/* Step 3 — payment */}
          <AccordionStep
            number={3}
            title="Оплата"
            summary={paymentSummary}
            isOpen={openStep === 2}
            isCompleted={completedSteps.has(2)}
            isLocked={!completedSteps.has(1)}
            onEdit={() => setOpenStep(2)}
          >
            <div className="space-y-3">
              {PAYMENT_BY_DELIVERY[deliveryType].map(method => (
                <button key={method} onClick={() => setPaymentMethod(method)}
                  disabled={method === 'Online'}
                  className={`w-full py-3 px-4 rounded-lg border text-sm text-left transition-colors ${
                    paymentMethod === method ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}>
                  {PAYMENT_LABELS[method]}
                </button>
              ))}
              <button
                onClick={() => completeStep(2)}
                className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 mt-1"
              >
                Далі
              </button>
            </div>
          </AccordionStep>

          {/* Submit button under accordion (mobile-friendly, also shown when all steps done) */}
          {allCompleted && (
            <button
              disabled={isPending}
              onClick={() => mutate()}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              {isPending ? 'Оформлення...' : 'Підтвердити замовлення'}
            </button>
          )}
        </div>

        {/* Right — order summary */}
        <div className="border border-gray-100 rounded-xl overflow-hidden lg:sticky lg:top-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-5 py-4 bg-gray-50">
            Ваше замовлення
          </p>
          <div className="divide-y divide-gray-100">
            {basket.items.map(item => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3 px-5 py-4">
                <Link href={`/products/item/${item.productId}`} className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-200 text-xl">👟</div>
                  }
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                  {item.size && <p className="text-xs text-gray-400 mt-0.5">Розмір: {item.size}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => item.quantity > 1
                        ? updateBasketItem({ item, quantity: item.quantity - 1 })
                        : removeBasketItem({ productId: item.productId, size: item.size })
                      }
                      className="w-6 h-6 rounded border border-gray-200 text-gray-500 text-xs flex items-center justify-center hover:border-gray-400 transition-colors"
                    >−</button>
                    <span className="text-sm text-gray-700 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateBasketItem({ item, quantity: item.quantity + 1 })}
                      className="w-6 h-6 rounded border border-gray-200 text-gray-500 text-xs flex items-center justify-center hover:border-gray-400 transition-colors"
                    >+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <p className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeBasketItem({ productId: item.productId, size: item.size })}
                    className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex justify-between text-sm font-semibold text-gray-900 mb-4">
              <span>Разом</span>
              <span>${basket.totalPrice.toFixed(2)}</span>
            </div>
            <button
              disabled={!allCompleted || isPending}
              onClick={() => mutate()}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Оформлення...' : 'Підтвердити замовлення'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
