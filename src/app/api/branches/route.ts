import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" }
    })
    return NextResponse.json({ branches })
  } catch (error) {
    console.error("Branches GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { name, location, contactNum, head } = await req.json()

    const newBranch = await prisma.branch.create({
      data: { name, location, contactNum, head }
    })
    
    return NextResponse.json({ success: true, newBranch })
  } catch (error) {
    console.error("Branches POST Error:", error)
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 })
  }
}
