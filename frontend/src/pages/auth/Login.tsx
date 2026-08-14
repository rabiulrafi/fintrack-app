import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoggingIn } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
    } catch {
      // Toast notification handled in useAuth hook
    }
  }

  const fillDemoCredentials = () => {
    setValue('email', 'demo@example.com')
    setValue('password', 'Demo@12345')
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Sign in to your account</h3>
        <p className="text-xs text-gray-500 mt-1">
          Welcome back! Access your financial insights.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="lg"
          isLoading={isLoggingIn}
        >
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="mt-6 p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 text-center">
        <p className="text-xs text-gray-600 font-medium mb-2">Need a quick test login?</p>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-xs font-bold text-primary-600 hover:text-primary-700 underline"
        >
          Click here to auto-fill demo credentials
        </button>
        <div className="text-[11px] text-gray-400 mt-1">
          demo@example.com / Demo@12345
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
          Create an account
        </Link>
      </div>
    </div>
  )
}
