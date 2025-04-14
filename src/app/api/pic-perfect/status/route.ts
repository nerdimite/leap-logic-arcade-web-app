import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: "API_BASE_URL environment variable is not set" },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiBaseUrl}/pic-perfect/status`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in pic-perfect status API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
