import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const teamName = request.headers.get("team-name");

    if (!teamName) {
      return NextResponse.json(
        { error: "team-name header is required" },
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

    const response = await fetch(`${apiBaseUrl}/pic-perfect/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "team-name": teamName,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in pic-perfect submit API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
