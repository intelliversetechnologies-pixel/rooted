import { MongoClient, type ObjectId } from "mongodb"

export interface ProviderDocument {
  _id?: ObjectId
  email: string
  emailLowercase: string
  passwordHash: string
  businessName: string
  firstName: string
  lastName: string
  phone?: string | null
  createdAt: Date
  updatedAt: Date
  status: "pending" | "active"
}

export interface UserDocument {
  _id?: ObjectId
  email: string
  emailLowercase: string
  passwordHash: string
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

const uri = process.env.MONGODB_URI

const inferredDbName = (() => {
  if (!uri) {
    return undefined
  }

  try {
    const normalised = uri.replace("mongodb+srv://", "https://").replace("mongodb://", "https://")
    const url = new URL(normalised)
    const pathname = url.pathname.replace(/^\//, "")
    return pathname ? decodeURIComponent(pathname) : undefined
  } catch (error) {
    console.warn("Failed to infer database name from MONGODB_URI", error)
    return undefined
  }
})()

const PROVIDER_DB = process.env.MONGODB_PROVIDER_DB || inferredDbName || "rooted"
const PROVIDER_COLLECTION = process.env.MONGODB_PROVIDER_COLLECTION || "service provider"

const USER_DB = process.env.MONGODB_USER_DB || inferredDbName || "Rooted"
const USER_COLLECTION = process.env.MONGODB_USER_COLLECTION || "users"

type MongoClientPromise = Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: MongoClientPromise | undefined
}

let clientPromise: MongoClientPromise | undefined

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    clientPromise = new MongoClient(uri).connect()
  }
}

async function getClient() {
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect()
  }

  return clientPromise
}

export async function getProvidersCollection() {
  const client = await getClient()
  return client.db(PROVIDER_DB).collection<ProviderDocument>(PROVIDER_COLLECTION)
}

export async function getUsersCollection() {
  const client = await getClient()
  return client.db(USER_DB).collection<UserDocument>(USER_COLLECTION)
}

export default clientPromise
