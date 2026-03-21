"use client"

import axios, { AxiosError } from 'axios'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/user.types'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VerifyAccount({ token }: { token: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    async function handleVerify() {
        setIsLoading(true)

        try {
            const { data } = await axios.post<ApiResponse<undefined>>("/api/users/auth/verify-email", { token })
            if (data.success) {
                toast.success(data.message)
                router.replace("/login")
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) 
                toast.error(error.response?.data?.message || "Verifeation faild please try again")
            else 
                toast.error("Verifeation faild please try again")
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <>
        <Button
            disabled={isLoading}
            onClick={handleVerify}
        >
            {isLoading ? <Loader2 className='animate-spin' /> : "Verify Account"}
        </Button>
    </>
  )
}
