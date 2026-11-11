'use client'

import type { LoginFormData } from '@/validation/loginSchema'
import api from '@/services/api'
import type { SignUpFormData } from '@/validation/signUpSchema'
import type { User } from '@/types/project'

const login = async (data: LoginFormData) => {
  const user = await api.post<User>('/auth/login', data)

  if (!user) {
    return false
  }

  return user
}

const signup = async (data: SignUpFormData) => {
  const user = await api.post<User>('/auth/signup', data)

  if (!user) {
    return false
  }

  return user
}

const logout = async () => {
  const data = await api.post('/auth/logout')

  return data
}

const forgotPassword = async (email: string) => {
  const data = await api.post('/users/forgot-password', { email })

  return data
}

const resetPassword = async (data: { newPassword: string; token: string }) => {
  const response = await api.patch('/users/reset-password', data)

  return response
}

const verifyPasswordResetToken = async (token: string) => {
  const response = await api.get(`/users/verify-password-reset/${token}`)

  return response
}

const updateName = async (name: string) => {
  const response = await api.patch(`/auth`, {
    name
  })

  return response
}

const updatePassword = async (data: { newPassword: string; password: string }) => {
  const response = await api.put('/auth/update-password', data)

  return response
}

export const AuthService = {
  login,
  signup,
  logout,
  forgotPassword,
  resetPassword,
  verifyPasswordResetToken,
  updateName,
  updatePassword
}
