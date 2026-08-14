import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest, RegisterRequest } from '@/types'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.user, res.access_token, res.refresh_token)
      toast.success(`Welcome back, ${res.user.full_name}!`)
      navigate('/dashboard')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Login failed')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.user, res.access_token, res.refresh_token)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Registration failed')
    },
  })

  const logout = () => {
    authApi.logout().catch(() => {})
    clearAuth()
    navigate('/login')
  }

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  }
}
