import { create } from 'zustand'

interface AuthState {
  token: string | null,
  setToken: (token: string) => void,
  clearToken: () => void,
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  setToken: (token) => set({token}),
  clearToken: () => set({token: null}),
  isAuthenticated: () => get().token !== null
}))
