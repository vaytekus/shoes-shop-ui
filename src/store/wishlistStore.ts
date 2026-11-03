import { create } from 'zustand'
import type { WishlistItem } from '@/types'
import { getWishlist, addToWishlist, removeFromWishlist, mergeWishlist } from '@/api/wishlistApi'

const STORAGE_KEY = 'wishlist'

interface WishlistState {
  items: WishlistItem[]
  loadFromStorage: () => void
  loadFromApi: (customerId: string) => Promise<void>
  mergeAndLoad: (customerId: string) => Promise<void>
  toggle: (item: WishlistItem, customerId: string | null) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) set({ items: JSON.parse(stored) })
    } catch {}
  },

  loadFromApi: async (customerId) => {
    const wishlist = await getWishlist(customerId)
    set({ items: wishlist.items })
  },

  mergeAndLoad: async (customerId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const localItems: WishlistItem[] = stored ? JSON.parse(stored) : []

      if (localItems.length > 0) {
        const merged = await mergeWishlist(customerId, localItems)
        set({ items: merged.items })
        localStorage.removeItem(STORAGE_KEY)
      } else {
        const wishlist = await getWishlist(customerId)
        set({ items: wishlist.items })
      }
    } catch {}
  },

  toggle: async (item, customerId) => {
    const { items } = get()
    const exists = items.some(i => i.productId === item.productId)

    if (customerId) {
      if (exists) {
        await removeFromWishlist(customerId, item.productId)
        set({ items: items.filter(i => i.productId !== item.productId) })
      } else {
        const result = await addToWishlist(customerId, item)
        set({ items: result.items })
      }
    } else {
      const newItems = exists
        ? items.filter(i => i.productId !== item.productId)
        : [...items, item]
      set({ items: newItems })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    }
  },

  isInWishlist: (productId) => get().items.some(i => i.productId === productId),
}))
