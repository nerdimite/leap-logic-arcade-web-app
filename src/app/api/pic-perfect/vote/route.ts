import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";

const voteSchema = z.object({
  voted_teams: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const teamName = headersList.get("team-name");

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedBody = voteSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
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

    const response = await fetch(`${apiBaseUrl}/pic-perfect/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "team-name": teamName,
      },
      body: JSON.stringify({
        voted_teams: validatedBody.data.voted_teams,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to submit votes" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in vote API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
