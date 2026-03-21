"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ForgotPasswordData, ForgotPasswordSchema } from '@/lib/schema/user.schema'
import { ApiResponse } from '@/types/user.types'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function ForgotPassword() {
    const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm<ForgotPasswordData>({
        resolver: zodResolver(ForgotPasswordSchema)
    })

    async function onSubmit(formData: ForgotPasswordData) {
        try {
            const { data } = await axios.post<ApiResponse<undefined>>("/api/users/auth/forgot-password", formData)
            if (data.success) {
                toast.success(data.message)
            }
            reset()
        } catch (error: unknown) {
            toast.error(
                error instanceof AxiosError ? error.response?.data.message : "Something went wrong!"
            )
        }
    }

  return (
    <div className='min-h-dvh w-full flex items-center justify-center'>
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
            </CardHeader>

            <CardContent>
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <Input { ...register("email") } type='email' placeholder='Enter your email' />
                    <p className='text-sm text-destructive'>{errors.email && errors.email.message}</p>
                    <Button type='submit' className='w-full' disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className='animate-spin' /> : "Submit"}
                    </Button>
                </form>
            </CardContent>

            <CardFooter>
                <p>Go to <Link href="/login" className='text-blue-500'>Login</Link></p>
            </CardFooter>
        </Card>
    </div>
  )
}
