import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * GET /api/pubg/agent/available-tools
 * Get the list of available tools for the AI agent
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
    const response = await fetch(
      `${apiBaseUrl}/api/pubg/agent/available-tools`,
      {
        method: "GET",
        headers: {
          "team-name": teamName,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch available tools" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUBG agent available-tools API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
