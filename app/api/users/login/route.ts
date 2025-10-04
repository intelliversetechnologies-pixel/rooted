import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { getUsersCollection } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const users = await getUsersCollection()
    const user = await users.findOne({ emailLowercase: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error) {
    console.error("User login failed", error)

    let message = "Unable to sign in"
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      message = "Server database configuration is missing"
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
