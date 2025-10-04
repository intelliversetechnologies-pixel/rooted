import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { getProvidersCollection } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const providers = await getProvidersCollection()
    const provider = await providers.findOne({ emailLowercase: email.toLowerCase() })

    if (!provider) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, provider.passwordHash)
    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      provider: {
        id: provider._id,
        email: provider.email,
        businessName: provider.businessName,
        firstName: provider.firstName,
        lastName: provider.lastName,
        status: provider.status,
      },
    })
  } catch (error) {
    console.error("Provider login failed", error)

    let message = "Unable to sign in"
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      message = "Server database configuration is missing"
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
