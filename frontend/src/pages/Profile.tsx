import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (user) {
        setUser({ ...user, full_name: data.full_name })
        toast.success('Profile updated successfully')
      }
    } catch {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Profile</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal details and application profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Summary Card */}
        <Card className="md:col-span-1 text-center flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-3xl mb-4 border-2 border-primary-200">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{user?.full_name}</h3>
          <p className="text-xs text-gray-500">{user?.email}</p>

          <div className="w-full mt-6 pt-4 border-t border-gray-100 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Status:
              </span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> Joined:
              </span>
              <span>{formatDate(user?.created_at?.slice(0, 10))}</span>
            </div>
          </div>
        </Card>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Edit Profile Details" subtitle="Update your personal identification information">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.full_name?.message}
                {...register('full_name')}
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Email address cannot be changed directly"
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
