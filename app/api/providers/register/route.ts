import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { getProvidersCollection } from "@/lib/mongodb"

const REQUIRED_FIELDS = ["businessName", "firstName", "lastName", "email", "password"] as const

type ProviderPayload = {
  [K in (typeof REQUIRED_FIELDS)[number]]: string
} & {
  phone?: string
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ProviderPayload>

    for (const field of REQUIRED_FIELDS) {
      if (!payload[field] || typeof payload[field] !== "string") {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const email = payload.email!.trim()
    const normalizedEmail = email.toLowerCase()
    const password = payload.password!.trim()

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const providers = await getProvidersCollection()

    const existing = await providers.findOne({ emailLowercase: normalizedEmail })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date()

    const providerDocument = {
      email,
      emailLowercase: normalizedEmail,
      passwordHash,
      businessName: payload.businessName!.trim(),
      firstName: payload.firstName!.trim(),
      lastName: payload.lastName!.trim(),
      phone: payload.phone?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
      status: "pending" as const,
    }

    const insertResult = await providers.insertOne(providerDocument)

    return NextResponse.json(
      {
        message: "Provider registered",
        providerId: insertResult.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Provider registration failed", error)

    let message = "Unable to complete registration"

    if (error instanceof Error) {
      if (error.message.includes("MONGODB_URI")) {
        message = "Server database configuration is missing"
      } else if (process.env.NODE_ENV !== "production") {
        message = error.message
      }
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
