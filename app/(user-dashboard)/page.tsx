import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiResponse } from "@/types/user.types"
import { User } from "lucide-react"
import { cookies } from "next/headers"

type User = {
  username: string,
  email: string,
  createdAt: Date
}

export default async function Home() {
  const cookieStore = await cookies()
  const res = await fetch("http://localhost:3000/api/users/auth/me", {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const data = await res.json() as ApiResponse<User>

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-extrabold text-gray-800">Well Come to Dashboard</h1>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <User size={15} />
              <p>User Profile</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <h1>{data.data?.username}</h1>
          <p>{data.data?.email}</p>
        </CardContent>
      </Card>
    </main>
  )
}
