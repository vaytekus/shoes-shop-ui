import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'

const GUEST_ID_KEY = 'guest_id'

const getOrCreateGuestId = (): string => {
  let guestId = localStorage.getItem(GUEST_ID_KEY)
  if(!guestId){
    guestId = crypto.randomUUID()
    localStorage.setItem(GUEST_ID_KEY, guestId)
  }

  return guestId
}

export function useCustomerId(): string | null {
  const customerId = useAuthStore(state => state.customerId)
  const [guestId, setGuestId] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) setGuestId(getOrCreateGuestId())
  }, [customerId]);

  return customerId ?? guestId
}