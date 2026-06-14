import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"

import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const userEmail = session.user.email as string
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const [received, sent, allUsers] = await Promise.all([
      prisma.message.findMany({
        where: { receiverId: user.id },
        include: { sender: { select: { name: true, role: true } } },
        orderBy: { timestamp: "desc" }
      }),
      prisma.message.findMany({
        where: { senderId: user.id },
        include: { receiver: { select: { name: true, role: true } } },
        orderBy: { timestamp: "desc" }
      }),
      prisma.user.findMany({ select: { id: true, name: true, role: true } })
    ])

    return NextResponse.json({ received, sent, users: allUsers })
  } catch (error) {
    console.error("Messaging GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { receiverId, content } = await req.json()
    const user = await prisma.user.findUnique({ where: { email: session.user.email as string } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content
      }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Messaging POST Error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { id, isRead } = await req.json()
    const message = await prisma.message.update({
      where: { id },
      data: { isRead }
    })
    return NextResponse.json({ message })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}
