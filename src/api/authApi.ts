import axios from 'axios'
import client from './client'

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL

export async function loginRequest(email: string, password: string): Promise<string> {
  const { data } = await client.post('/api/users/login', {email, password})
  return data.accessToken
}

export async function refreshTokenRequest(): Promise<string> {
  const { data } = await client.post('/api/users/refresh', {}, {withCredentials: true})
  return data.accessToken
}

export async function logoutRequest(): Promise<void> {
  await client.post('/api/users/logout')
}

export async function registerRequest(email: string, password: string, firstName: string, lastName: string) {
  return client.post('/api/users/register', {email, password, firstName, lastName})
}

export async function updateProfileRequest(firstName: string, lastName: string, email: string) {
  return client.put('/api/users/me', {firstName, lastName, email})
}

export async function changePasswordRequest(currentPassword: string, newPassword: string) {
  return client.put('/api/users/me/password', {currentPassword, newPassword})
}

export async function deleteAccountRequest() {
  return client.delete('/api/users/me')
}

export async function getMeRequest() {
  return client.get<{ firstName: string; lastName: string; email: string; avatarUrl: string | null }>('/api/users/me')
}

export async function uploadAvatarRequest(file: File) {
  const form = new FormData()
  form.append('file', file)
  return client.post<{ avatarUrl: string }>('/api/users/me/avatar', form, {
    headers: { 'Content-Type': undefined }
  })
}
