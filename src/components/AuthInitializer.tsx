'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'

export default function AuthInitializer(){
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const setInitialized = useAuthStore(state => state.setInitialized)

  useEffect(() => {
    axios.post('/api/users/refresh', {}, {withCredentials: true})
      .then(({data}) => {
        setAccessToken(data.accessToken)
        setInitialized()
      })
      .catch(() => {
        setInitialized()
      })
  }, [])

  return null
}