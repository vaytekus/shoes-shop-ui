'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { changePasswordRequest } from '@/api/authApi'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const changePassword = useMutation({
    mutationFn: () => changePasswordRequest(currentPassword, newPassword),
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      alert('Password changed')
    },
  })

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>
      <div className="flex flex-col gap-3 max-w-sm">
        <div className="relative">
          <input
            type={showPasswords ? 'text' : 'password'}
            placeholder="Current Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {showPasswords ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="relative">
          <input
            type={showPasswords ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
          />
        </div>
        {changePassword.error && (
          <p className="text-red-500 text-sm">
            {(changePassword.error as any)?.response?.data?.detail || 'Failed to change password'}
          </p>
        )}
        <button
          onClick={() => changePassword.mutate()}
          disabled={changePassword.isPending}
          className="bg-gray-900 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {changePassword.isPending ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </div>
  )
}
