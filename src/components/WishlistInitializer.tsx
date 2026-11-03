'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useWishlistStore } from '@/store/wishlistStore'

export default function WishlistInitializer() {
  const customerId = useAuthStore(state => state.customerId)
  const isInitialized = useAuthStore(state => state.isInitialized)
  const { loadFromStorage, mergeAndLoad } = useWishlistStore()

  useEffect(() => {
    if (!isInitialized) return
    if (customerId) {
      mergeAndLoad(customerId)
    } else {
      loadFromStorage()
    }
  }, [isInitialized, customerId])

  return null
}
