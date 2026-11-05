'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { changePasswordRequest } from '@/api/authApi'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [saved, setSaved] = useState(false)

  const changePassword = useMutation({
    mutationFn: () => changePasswordRequest(currentPassword, newPassword),
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      setSaved(true)
    },
  })

  return (
    <div className="max-w-sm space-y-4">
      <h2 className="text-lg font-semibold">Змінити пароль</h2>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type={showPasswords ? 'text' : 'password'}
            placeholder="Поточний пароль"
            value={currentPassword}
            onChange={e => { setCurrentPassword(e.target.value); setSaved(false) }}
            className="w-full border border-gray-200 px-3 py-2 text-sm pr-16 focus:outline-none focus:border-gray-900"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {showPasswords ? 'Сховати' : 'Показати'}
          </button>
        </div>
        <input
          type={showPasswords ? 'text' : 'password'}
          placeholder="Новий пароль"
          value={newPassword}
          onChange={e => { setNewPassword(e.target.value); setSaved(false) }}
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
        />
        {changePassword.isError && (
          <p className="text-red-500 text-sm">
            {(changePassword.error as any)?.response?.data?.detail || 'Не вдалося змінити пароль'}
          </p>
        )}
        {saved && <p className="text-green-600 text-sm">Пароль змінено</p>}
        <button
          onClick={() => changePassword.mutate()}
          disabled={changePassword.isPending}
          className="bg-gray-900 text-white py-2 text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {changePassword.isPending ? 'Збереження...' : 'Змінити пароль'}
        </button>
      </div>
    </div>
  )
}
