import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

// Schema for validating the tool creation request
const toolCreateSchema = z.object({
  tool_name: z.string().min(1),
  description: z.string().min(1),
});

// Schema for validating the tool update request
const toolUpdateSchema = z.object({
  tool_name: z.string().min(1),
  description: z.string().min(1),
});

/**
 * GET /api/pubg/agent/tool
 * Get the list of team-specific tools for the AI agent
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
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/tool`, {
      method: "GET",
      headers: {
        "team-name": teamName,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch team tools" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUBG agent team tools API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pubg/agent/tool
 * Create a new tool for the team
 */
export async function POST(req: Request) {
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
    const validatedBody = toolCreateSchema.safeParse(body);

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
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/tool`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "team-name": teamName,
      },
      body: JSON.stringify(validatedBody.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to create tool" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in PUBG agent tool creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pubg/agent/tool
 * Update a tool's description
 */
export async function PATCH(request: Request) {
  try {
    const headersList = await headers();
    const teamName = headersList.get("team-name");

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required in headers" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedBody = toolUpdateSchema.safeParse(body);

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
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/tool`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "team-name": teamName,
      },
      body: JSON.stringify(validatedBody.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to update tool" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUBG agent tool update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
