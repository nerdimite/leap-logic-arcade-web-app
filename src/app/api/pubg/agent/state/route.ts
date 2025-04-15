import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

// Schema for validating the state update request
const stateUpdateSchema = z.object({
  system_message: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  last_response_id: z.string().optional(),
});

/**
 * GET /api/pubg/agent/state
 * Get the current state of the AI agent for a team
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
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/state`, {
      method: "GET",
      headers: {
        "team-name": teamName,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in PUBG agent state API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pubg/agent/state
 * Update the state of the AI agent for a team
 */
export async function PATCH(req: Request) {
  try {
    const teamName = req.headers.get("team-name");

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required in headers" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedBody = stateUpdateSchema.safeParse(body);

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
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/state`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "team-name": teamName,
      },
      body: JSON.stringify(validatedBody.data),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in PUBG agent state update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
