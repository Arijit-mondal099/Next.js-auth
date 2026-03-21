"use client"

import { toast } from 'sonner'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()

    async function handleLogout() {
        try {
            await axios.post("/api/users/auth/logout", {})
            toast.success("Logout successfully")
            router.replace("/login")
        } catch (error: unknown) {
            toast.error(error instanceof AxiosError && error.response?.data?.message || "Faild to logout")
        }   
    }

  return (
    <nav className='fixed top-0 left-0 w-full h-16 flex items-center justify-between px-20 border-b border-gray-200 shadow'>
        <h1>Next Auth</h1>
        <Button
            onClick={handleLogout}
        >
            <span>Logout</span>
            <LogOut />
        </Button>
    </nav>
  )
}
