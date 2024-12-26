import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/db";

export async function POST(req: NextRequest) {
  const session = await auth();

  // Check user session
  if (!session || !session.user) {
    return NextResponse.json(
      { msg: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { url } = body;

    // Check if the website belongs to the user
    const validWebsite = await prisma?.website.findFirst({
      where: {
        url: url,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    if (!validWebsite) {
      return NextResponse.json(
        { msg: "Not a valid website for this user" },
        { status: 400 }
      );
    }

    const apiKey = validWebsite.user.apiKey;
    // Verify the user's website API
    let response;
    try {
      response = await axios.post(
        `${url}/api/droplert/verify`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
    } catch (err) {
      console.error("Error during API verification:", err);
      return NextResponse.json(
        { msg: "Failed to connect to website API" },
        { status: 502 }
      );
    }

    // Check response status
    if (response.status === 200) {
      // Update website verification status
      const verification = await prisma?.website.update({
        where: {
          id: validWebsite.id,
        },
        data: {
          isVerified: true,
          status:"ACTIVE"
        },
      });
      console.log(verification);
      return NextResponse.json(
        { msg: "API Key validation successful" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { msg: "API key validation is not successful" },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      { msg: "Error while sending test request" },
      { status: 500 }
    );
  }
}
