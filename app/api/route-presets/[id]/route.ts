import prisma from '@/db'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  // Authenticate the user session
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Accessing the id parameter
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop(); // Get the last segment of the path
  try {
    // Delete the route preset for the authenticated user
    await prisma.routePreset.delete({
      where: { 
        id,
        userId: session.user.id
      }
    });
    return NextResponse.json(null, { status: 204 }); // No content response
  } catch (error) {
    console.error('Delete route preset error:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
