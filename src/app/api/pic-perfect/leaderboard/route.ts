import { NextResponse } from "next/server";

interface LeaderboardEntry {
  deceptionPoints: number;
  imageUrl: string;
  challengeId: string;
  teamName: string;
  totalPoints: number;
  discoveryPoints: number;
  votedForHidden?: boolean;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  hidden_image: string | null;
  challenge_state: string;
}

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: "API_BASE_URL environment variable is not set" },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiBaseUrl}/pic-perfect/leaderboard`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch leaderboard" },
        { status: response.status }
      );
    }

    const data: LeaderboardResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in leaderboard API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
