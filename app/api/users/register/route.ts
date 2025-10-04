import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { getUsersCollection } from "@/lib/mongodb"

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "password"] as const

type UserPayload = {
  [K in (typeof REQUIRED_FIELDS)[number]]: string
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<UserPayload>

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

    const users = await getUsersCollection()

    const existing = await users.findOne({ emailLowercase: normalizedEmail })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date()

    const userDocument = {
      email,
      emailLowercase: normalizedEmail,
      passwordHash,
      firstName: payload.firstName!.trim(),
      lastName: payload.lastName!.trim(),
      createdAt: now,
      updatedAt: now,
    }

    const insertResult = await users.insertOne(userDocument)

    return NextResponse.json(
      {
        message: "User registered",
        userId: insertResult.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("User registration failed", error)

    let message = "Unable to complete registration"
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      message = "Server database configuration is missing"
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
