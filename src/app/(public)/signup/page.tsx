import { Suspense } from 'react'
import SignupForm from "./SignupForm"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-muted rounded-xl" />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}