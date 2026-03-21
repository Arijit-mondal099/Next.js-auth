"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChangePasswordData, ChangePasswordSchema } from '@/lib/schema/user.schema'
import { ApiResponse } from '@/types/user.types'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { use } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Params = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function VerifyPassword({ searchParams }: Params) {
    const { token } = use(searchParams) as { token: string }
    const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordData>({
        resolver: zodResolver(ChangePasswordSchema)
    })

    async function onSubmit(formData: ChangePasswordData) {
        if (formData.password !== formData.confirmPassword)  {
            toast.error("Oops new password and confirm password dosen't matched!")
            return
        }

        try {
            const { data } = await axios.post<ApiResponse<undefined>>("/api/users/auth/change-password", { password: formData.password, token })
            if (data.success) {
                toast.success(data.message)
                reset()
            }
        } catch (error: unknown) {
            console.log(error)
            toast.error(error instanceof AxiosError ? error.response?.data.message : "Faild to login try again!")
        }
    }

  return (
    <div className='min-h-dvh w-full flex items-center justify-center'>
        {!token?.trim() ? (
            <h1>Oops verify token not provided</h1>
        ) : (
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>
                        Change Password
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className='space-y-1'>
                            <Label htmlFor='new-password'>New Password</Label>
                            <Input { ...register("password") } type='password' id='new-password' placeholder='Enter new password' />
                            {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
                        </div>
                        <div className='space-y-1'>
                            <Label htmlFor='confirm-password'>Confirm Password</Label>
                            <Input { ...register("confirmPassword") } type='password' id='confirm-password' placeholder='Enter again new password' />
                            {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword.message}</p>}
                        </div>

                        <Button type='submit' disabled={isSubmitting} className='w-full'>
                            {isSubmitting ? <Loader2 className='animate-spin' /> : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )}
    </div>
  )
}

