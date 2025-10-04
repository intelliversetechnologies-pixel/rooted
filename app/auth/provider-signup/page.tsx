"use client";

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProviderSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const businessName = (formData.get("businessName") as string).trim()
    const firstName = (formData.get("firstName") as string).trim()
    const lastName = (formData.get("lastName") as string).trim()
    const email = (formData.get("email") as string).trim()
    const phone = (formData.get("phone") as string | null)?.trim()
    const password = (formData.get("password") as string) || ""
    const confirmPassword = (formData.get("confirmPassword") as string) || ""

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/providers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          firstName,
          lastName,
          email,
          phone,
          password,
        }),
      })

      const contentType = response.headers.get("content-type") || ""
      let data: any = null
      let fallbackMessage: string | null = null

      if (contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error("Provider signup responded with non-JSON payload", text)
        fallbackMessage = "Unexpected response from the server"
      }

      if (!response.ok) {
        setError(data?.error || fallbackMessage || "Unable to create account")
      } else {
        router.push(`/auth/signup-success?email=${encodeURIComponent(email)}&type=provider`)
      }
    } catch (err: any) {
      console.error("Provider signup failed", err)
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
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
        <div className="w-full max-w-lg">
          <Link
            href="/auth/signup"
            className="flex items-center space-x-2 mb-8 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Rooted Provider</h1>
            <p className="text-gray-600">
              Showcase your services, manage bookings, and connect with new clients on Rooted.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-900 mb-2">
                Business Name
              </label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                className="w-full h-12 border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
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
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full h-12 border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Work Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                className="w-full h-12 border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="w-full h-12 border-gray-300 rounded-lg"
                placeholder="+44 7123 456789"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full h-12 border-gray-300 rounded-lg"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full h-12 border-gray-300 rounded-lg"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Create provider account"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Prefer to book services?{" "}
              <Link href="/auth/signup" className="text-gray-900 font-medium hover:underline">
                Sign up as a customer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
