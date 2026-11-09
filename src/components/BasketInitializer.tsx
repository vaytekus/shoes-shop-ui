'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useQueryClient } from '@tanstack/react-query'
import { mergeBasket } from '@/api/basketApi'

const GUEST_ID_KEY = 'guest_id'

export default function BasketInitializer() {
  const customerId = useAuthStore(state => state.customerId)
  const isInitialized = useAuthStore(state => state.isInitialized)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isInitialized || !customerId) return

    const guestId = localStorage.getItem(GUEST_ID_KEY)
    if (!guestId) return

    mergeBasket(customerId, guestId).then(() => {
      localStorage.removeItem(GUEST_ID_KEY)
      queryClient.invalidateQueries({ queryKey: ['basket', customerId] })
    })
  }, [isInitialized, customerId])

  return null
}
