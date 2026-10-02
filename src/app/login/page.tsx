'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { loginRequest } from '@/api/authApi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setToken = useAuthStore(state => state.setToken)
  const router = useRouter()

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (token) => {
      setToken(token)
      router.push('/orders')
    },
  })

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />

        {error && <p className="text-red-500 text-sm">Invalid email or password</p>}

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="bg-gray-900 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}