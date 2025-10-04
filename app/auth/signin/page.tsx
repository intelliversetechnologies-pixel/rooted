"use client";

import React, { useState } from "react";
import { ArrowLeft, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [accountType, setAccountType] = useState<"customer" | "provider">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const emailValue = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string) || "";

    try {
      const endpoint = accountType === "provider" ? "/api/providers/login" : "/api/users/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailValue, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      let data: any = null;
      let fallbackMessage: string | null = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Sign in responded with non-JSON payload", text);
        fallbackMessage = "Unexpected response from the server";
      }

      if (!response.ok) {
        setError(data?.error || fallbackMessage || "Invalid email or password");
      } else {
        if (typeof window !== "undefined") {
          if (accountType === "provider") {
            window.localStorage.setItem(
              "rooted.provider",
              JSON.stringify({
                id: data?.provider?.id,
                email: data?.provider?.email,
                businessName: data?.provider?.businessName,
                status: data?.provider?.status,
              })
            );
          } else {
            window.localStorage.setItem(
              "rooted.user",
              JSON.stringify({
                id: data?.user?.id,
                email: data?.user?.email,
                firstName: data?.user?.firstName,
                lastName: data?.user?.lastName,
              })
            );
          }
        }
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center space-x-2 mb-8 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">I am a...</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("customer")}
                className={`p-4 border-2 rounded-xl transition-colors ${
                  accountType === "customer" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <User className="w-6 h-6 text-gray-600" />
                  <span className="font-medium text-gray-900">Customer</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("provider")}
                className={`p-4 border-2 rounded-xl transition-colors ${
                  accountType === "provider" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Briefcase className="w-6 h-6 text-gray-600" />
                  <span className="font-medium text-gray-900">Provider</span>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <Input name="email" id="email" type="email" className="w-full h-12 border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <Input name="password" id="password" type="password" className="w-full h-12 border-gray-300 rounded-lg" required />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in >"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-gray-900 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
