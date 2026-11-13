'use client'

import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { updateProfileRequest, deleteAccountRequest, getMeRequest, uploadAvatarRequest } from '@/api/authApi'
import { User } from 'lucide-react'
import AvatarCropModal from '@/components/profile/AvatarCropModal'

export default function ProfilePage() {
  const accessToken = useAuthStore(state => state.accessToken)
  const clearAccessToken = useAuthStore(state => state.clearAccessToken)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    () => typeof window !== 'undefined' ? localStorage.getItem('avatarUrl') : null
  )
  const [saved, setSaved] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMeRequest().then(r => r.data),
    enabled: !!accessToken,
  })

  useEffect(() => {
    if (!profile) return
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setEmail(profile.email)
    if (profile.avatarUrl) {
      setAvatarUrl(profile.avatarUrl)
      localStorage.setItem('avatarUrl', profile.avatarUrl)
    }
  }, [profile])

  const updateProfile = useMutation({
    mutationFn: () => updateProfileRequest(firstName, lastName, email),
    onSuccess: () => setSaved(true),
  })

  const uploadAvatar = useMutation({
    mutationFn: (file: File) => uploadAvatarRequest(file).then(r => r.data),
    onSuccess: (data) => {
      setAvatarUrl(`${data.avatarUrl}?t=${Date.now()}`)
      localStorage.setItem('avatarUrl', data.avatarUrl)
      setCropSrc(null)
    },
  })

  const deleteAccount = useMutation({
    mutationFn: deleteAccountRequest,
    onSuccess: () => { clearAccessToken(); router.push('/') },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          onConfirm={file => uploadAvatar.mutate(file)}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="max-w-sm space-y-10">
        <section>
          <div className="flex gap-8 items-start">
            <div className="shrink-0 flex flex-col items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-200 hover:border-gray-900 transition-colors group"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <User className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs">Змінити</span>
                </div>
              </button>
              {uploadAvatar.isPending && <p className="text-xs text-gray-400">Завантаження...</p>}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col gap-3 flex-1">
              <input
                type="text"
                placeholder="Ім'я"
                value={firstName}
                onChange={e => { setFirstName(e.target.value); setSaved(false) }}
                className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
              <input
                type="text"
                placeholder="Прізвище"
                value={lastName}
                onChange={e => { setLastName(e.target.value); setSaved(false) }}
                className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setSaved(false) }}
                className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
              {updateProfile.isError && <p className="text-red-500 text-sm">Не вдалося зберегти зміни</p>}
              {saved && <p className="text-green-600 text-sm">Збережено</p>}
              <button
                onClick={() => updateProfile.mutate()}
                disabled={updateProfile.isPending}
                className="bg-gray-900 text-white py-2 text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {updateProfile.isPending ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 pt-8 flex items-center gap-6">
          <button
            onClick={() => { if (confirm('Видалити акаунт?')) deleteAccount.mutate() }}
            disabled={deleteAccount.isPending}
            className="shrink-0 border border-red-200 text-red-600 py-2 px-4 text-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {deleteAccount.isPending ? 'Видалення...' : 'Видалити акаунт'}
          </button>
          <p className="text-xs text-gray-400">Буде видалено ваш акаунт, дані профілю та історія входів. Замовлення залишаться в системі. Цю дію неможливо скасувати.</p>
        </section>
      </div>
    </>
  )
}
