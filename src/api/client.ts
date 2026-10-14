import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const client = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  response => response,
  async(error) => {
    const original = error.config
    if(error.response?.status === 401 && !original._retry){
      original._retry = true
      try {
        const { data } = await axios.post('/api/users/refresh', {}, {withCredentials: true})
        useAuthStore.getState().setAccessToken(data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return client(original)
      } catch {
        useAuthStore.getState().clearAccessToken()
      }
    }
    return Promise.reject(error)
  }
)

export default client