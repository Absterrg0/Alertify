// app/api/routePreset/[id]/route/route.ts
import prisma from '@/db'
import { auth } from '@/lib/auth'
import { getSession } from 'next-auth/react'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  try {
    await prisma.routePreset.delete({
      where: { 
        id: id, // Ensure the `id` is passed correctly
        userId: session.user.id
      }
    })
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: error }, { status: 500 })
  }
}
