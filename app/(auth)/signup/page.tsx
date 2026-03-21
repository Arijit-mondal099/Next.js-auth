"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserSignupFormData, UserSignupSechma } from "@/lib/schema/user.schema"
import { ApiResponse } from "@/types/user.types"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function Signup() {
  const { reset, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserSignupFormData>({ 
    resolver: zodResolver(UserSignupSechma) 
  })
  const router = useRouter()

  async function onSubmit(formData: UserSignupFormData) {
    try {
      const { data } = await axios.post<ApiResponse<{ userId: string }>>("/api/users/auth/signup", formData)

      if (data?.success) {
        toast.success(data.message)
        router.replace("/login")
        reset()
      } else {
        toast.error(data.message)
      }
    } catch (error: unknown) {
      toast.error(error instanceof AxiosError ? error.response?.data?.message : "Faild to signup try again!")
    }
  }

  return (
    <div className="container mx-auto h-dvh flex items-center justify-center">
      <div className="max-w-lg w-full">
        <Card>
          <CardHeader>
            <CardTitle>Signup Your Account</CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input { ...register("username") } type="text" id="username" placeholder="jhon doe" />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input { ...register("email") } type="email" id="email" placeholder="jhondoe@xyz.com" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input { ...register("password") } type="password" id="password" placeholder="******" />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <Button className="w-full cursor-pointer" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Signup"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p>Alredy have an account <Link href="/login" className="text-blue-500">Login</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
