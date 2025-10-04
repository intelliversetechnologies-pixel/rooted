"use client";

import type React from "react"
import { useState } from "react"
import { ArrowLeft, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [step, setStep] = useState<"account-type" | "form">("account-type")
  const [accountType, setAccountType] = useState<"customer" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get("email") as string).trim()
    const password = (formData.get("password") as string) || ""
    const confirmPassword = (formData.get("confirmPassword") as string) || ""
    const firstName = (formData.get("firstName") as string).trim()
    const lastName = (formData.get("lastName") as string).trim()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      })

      const contentType = response.headers.get("content-type") || ""
      let data: any = null
      let fallbackMessage: string | null = null

      if (contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error("Customer signup responded with non-JSON payload", text)
        fallbackMessage = "Unexpected response from the server"
      }

      if (!response.ok) {
        setError(data?.error || fallbackMessage || "Unable to create account")
      } else {
        router.push(`/auth/signup-success?email=${encodeURIComponent(email)}&type=customer`)
      }
    } catch (err: any) {
      console.error("Customer signup error:", err)
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const goToProviderSignup = () => {
    router.push("/auth/provider-signup")
  }

  if (step === "account-type") {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login%20sign%20up.jpg-8Nh4L5bK7rz57QR27EpGxOg4Cxvity.jpeg"
            alt="Beauty professionals"
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="flex items-center space-x-2 mb-8 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">r.</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Rooted</h1>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">I want to...</h2>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setAccountType("customer")
                    setStep("form")
                  }}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Find Services</h3>
                      <p className="text-gray-600 text-sm">Connect with local service providers</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={goToProviderSignup}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Briefcase className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Offer Services</h3>
                      <p className="text-gray-600 text-sm">Create a provider account and list your business</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-gray-900 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login%20sign%20up.jpg-8Nh4L5bK7rz57QR27EpGxOg4Cxvity.jpeg"
          alt="Beauty professionals"
          className="w-full h-full object-cover rounded-r-3xl"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep("account-type")}
            className="flex items-center space-x-2 mb-8 text-gray-600 hover:text-gray-900 transition-colors"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">r.</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Sign up to discover and book beauty services near you</p>
          </div>

          {accountType === "customer" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    id="firstName"
                    type="text"
                    className="w-full h-12 border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    id="lastName"
                    type="text"
                    className="w-full h-12 border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  className="w-full h-12 border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  className="w-full h-12 border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  className="w-full h-12 border-gray-300 rounded-lg"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign up >"}
              </Button>
            </form>
          ) : (
            <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-600">
              Please select an account type to continue.
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-gray-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
