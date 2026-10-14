import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  customerId: string | null
  isInitialized: boolean
  setAccessToken: (accessToken: string) => void
  clearAccessToken: () => void
  setInitialized: () => void
  isAuthenticated: () => boolean
}

const parseSubFromToken = (token: string): string | null => {
  try{
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? null;
  }
  catch{
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  customerId: null,
  isInitialized: false,

  setAccessToken: (accessToken) => {
    set({ accessToken, customerId: parseSubFromToken(accessToken) })
  },
  clearAccessToken: () => {
    set({ accessToken: null, customerId: null })
  },
  setInitialized: () => {
    set({isInitialized: true})
  },
  isAuthenticated: () => get().accessToken !== null
}))
