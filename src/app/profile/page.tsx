'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { updateProfileRequest, deleteAccountRequest } from '@/api/authApi'

export default function ProfilePage() {
  const clearAccessToken = useAuthStore(state => state.clearAccessToken)
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const updateProfile = useMutation({
    mutationFn: () => updateProfileRequest(firstName, lastName, email),
    onSuccess: () => alert('Profile updated'),
  })

  const deleteAccount = useMutation({
    mutationFn: deleteAccountRequest,
    onSuccess: () => {
      clearAccessToken()
      router.push('/')
    },
  })

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
        <div className="flex flex-col gap-3">
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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          {updateProfile.error && (
            <p className="text-red-500 text-sm">Failed to update profile</p>
          )}
          <button
            onClick={() => updateProfile.mutate()}
            disabled={updateProfile.isPending}
            className="bg-gray-900 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-3">This action is permanent and cannot be undone.</p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete your account?')) {
              deleteAccount.mutate()
            }
          }}
          disabled={deleteAccount.isPending}
          className="bg-red-600 text-white py-2 px-4 rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
        </button>
      </section>
    </div>
  )
}
