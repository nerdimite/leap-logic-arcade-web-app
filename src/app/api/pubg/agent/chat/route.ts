import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";

// Schema for validating the chat message request
const messageSchema = z.object({
  message: z.string().min(1),
});

/**
 * POST /api/pubg/agent/chat
 * Send a chat message to the AI agent
 */
export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const teamName = headersList.get("team-name");

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required in headers" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedBody = messageSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validatedBody.error.errors },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: "API_BASE_URL environment variable is not set" },
        { status: 500 }
      );
    }

    // Forward the request to the actual backend API
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "team-name": teamName,
      },
      body: JSON.stringify({
        message: validatedBody.data.message,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in PUBG agent chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pubg/agent/chat
 * Get chat history for a team
 */
export async function GET() {
  try {
    const headersList = await headers();
    const teamName = headersList.get("team-name");

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required in headers" },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: "API_BASE_URL environment variable is not set" },
        { status: 500 }
      );
    }

    // Forward the request to the actual backend API
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/chat`, {
      method: "GET",
      headers: {
        "team-name": teamName,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in PUBG agent chat history API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
