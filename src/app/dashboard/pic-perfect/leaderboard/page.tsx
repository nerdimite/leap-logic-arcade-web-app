"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TerminalLoading } from "@/components/pic-perfect/terminal-loading";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  deceptionPoints: number;
  imageUrl: string;
  challengeId: string;
  teamName: string;
  totalPoints: number;
  discoveryPoints: number;
  votedForHidden?: boolean;
}

const getRankStyles = (rank: number) => {
  switch (rank) {
    case 0: // 1st place
      return "border-[#FFD700] border-2 bg-[#FFD700]/5"; // Gold
    case 1: // 2nd place
      return "border-[#C0C0C0] border-2 bg-[#C0C0C0]/5"; // Silver
    case 2: // 3rd place
      return "border-[#CD7F32] border-2 bg-[#CD7F32]/5"; // Bronze
    default:
      return "border hover:bg-muted/50";
  }
};

const getRankNumberStyles = (rank: number) => {
  switch (rank) {
    case 0: // 1st place
      return "bg-[#FFD700]/20 text-[#FFD700]"; // Gold
    case 1: // 2nd place
      return "bg-[#C0C0C0]/20 text-[#C0C0C0]"; // Silver
    case 2: // 3rd place
      return "bg-[#CD7F32]/20 text-[#CD7F32]"; // Bronze
    default:
      return "bg-primary/10 text-primary";
  }
};

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/pic-perfect/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      // Sort by total points in descending order
      const sortedLeaderboard = data.leaderboard.sort(
        (a: LeaderboardEntry, b: LeaderboardEntry) =>
          b.totalPoints - a.totalPoints
      );
      setLeaderboard(sortedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard", {
        description: "Please refresh the page to try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
        <TerminalLoading text="Loading leaderboard" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 p-6">
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="font-press-start-2p text-xl text-primary">
            Pic Perfect Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.teamName}
                className={cn(
                  "flex items-center gap-4 rounded-lg p-4 transition-colors",
                  getRankStyles(index)
                )}
              >
                {/* Rank */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold",
                    getRankNumberStyles(index)
                  )}
                >
                  #{index + 1}
                </div>

                {/* Image Thumbnail */}
                <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                  <Image
                    src={entry.imageUrl}
                    alt={`${entry.teamName}'s submission`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Team Info */}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="font-semibold">{entry.teamName}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-end">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">Deception</span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono">
                        {entry.deceptionPoints < 10
                          ? `0${entry.deceptionPoints}`
                          : entry.deceptionPoints}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">Discovery</span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono">
                        {entry.discoveryPoints < 10
                          ? `0${entry.discoveryPoints}`
                          : entry.discoveryPoints}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">Total</span>
                      <span className="rounded bg-primary px-2 py-0.5 font-mono text-primary-foreground">
                        {entry.totalPoints < 10
                          ? `0${entry.totalPoints}`
                          : entry.totalPoints}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
