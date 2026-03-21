import VerifyAccount from "@/components/verify-account"

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Verify({ searchParams }: Params) {
  const { token } = await searchParams as { token: string | undefined }

  return (
    <div className="h-dvh w-full flex items-center justify-center">
    {!token?.trim() ? (
      <h2 className="text-lg font-semibold text-destructive">Invalid Verification Token!</h2>
    ) : (
      <VerifyAccount token={token} />
    )}
    </div>
  )
}
