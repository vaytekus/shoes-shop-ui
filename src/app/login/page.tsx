'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { loginRequest, registerRequest } from '@/api/authApi'

type Mode = 'login' | 'register' | 'check-email'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (accessToken) => {
      setAccessToken(accessToken)
      router.push('/profile')
    },
  })

  const registerMutation = useMutation({
    mutationFn: () => registerRequest(email, password, firstName, lastName),
    onSuccess: () => {
      setMode('check-email')
      setPassword('')
    },
  })

  if (mode === 'check-email') {
    return (
      <div className="max-w-md mx-auto mt-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We sent a verification link to <span className="text-gray-900 font-medium">{email}</span>.
          Click the link in the email to activate your account.
        </p>
        <button
          onClick={() => setMode('login')}
          className="text-sm text-gray-900 underline"
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  const isLogin = mode === 'login'
  const mutation = isLogin ? loginMutation : registerMutation

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login')
    setPassword('')
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h1>

      <div className="flex flex-col gap-4">
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {mutation.error && (
          <p className="text-red-500 text-sm">
            {isLogin
              ? (loginMutation.error as any)?.response?.status === 403
                ? (loginMutation.error as any)?.response?.data?.detail
                : 'Invalid email or password'
              : (mutation.error as any)?.response?.data || 'Registration failed. Try again.'}
          </p>
        )}

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-gray-900 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {mutation.isPending
            ? isLogin ? 'Signing in...' : 'Creating account...'
            : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <p className="text-sm text-center text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={switchMode} className="text-gray-900 underline">
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
