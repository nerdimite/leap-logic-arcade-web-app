import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * DELETE /api/pubg/agent/tool/{tool_name}
 * Delete a specific tool for the team
 */
export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = await params;
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
    const response = await fetch(`${apiBaseUrl}/api/pubg/agent/tool/${name}`, {
      method: "DELETE",
      headers: {
        "team-name": teamName,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to delete tool" },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in PUBG agent tool delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
