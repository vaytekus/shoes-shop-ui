import { create } from 'zustand'

interface AuthState {
  token: string | null,
  customerId: string | null,
  setToken: (token: string) => void,
  clearToken: () => void,
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
  token: null,
  customerId: null,
  setToken: (token) => set({token, customerId: parseSubFromToken(token)}),
  clearToken: () => set({token: null, customerId: null}),
  isAuthenticated: () => get().token !== null
}))
