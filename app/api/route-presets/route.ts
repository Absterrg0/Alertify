import prisma from '@/db';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Define types for the route preset data
interface RoutePreset {
  name: string;
  routes: string[];
}

export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    const presets = await prisma.routePreset.findMany({
      where: { userId: session?.user?.id },
    });
    return new NextResponse(JSON.stringify(presets));
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error', error: (error as Error).message }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return new NextResponse(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    // Ensure the request body is parsed properly
    const body: RoutePreset = await req.json();
    const preset = await prisma.routePreset.create({
      data: {
        name: body.name,
        routes: body.routes,
        userId: session?.user?.id,
      },
    });
    return new NextResponse(JSON.stringify(preset));
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error', error: (error as Error).message }),
      { status: 500 }
    );
  }
}
