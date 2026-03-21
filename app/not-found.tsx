"use client"

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";


export default function NotFound() {

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center gap-6">
        <h1 className="text-destructive text-2xl font-bold">Oops Invalid Route</h1>
        <Button
            onClick={() => redirect("/", "replace")}
        >Back to Home</Button>
    </div>
  )
}
