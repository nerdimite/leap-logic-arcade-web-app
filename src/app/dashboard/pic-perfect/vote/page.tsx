"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TerminalLoading } from "@/components/pic-perfect/terminal-loading";
import { VotingGrid } from "@/components/pic-perfect/voting-grid";
import { Button } from "@/components/ui/button";

interface VotingPoolEntry {
  teamName: string;
  imageUrl: string;
}

type ChallengeState = "submission" | "voting" | string;

export default function VotePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [votingPool, setVotingPool] = useState<VotingPoolEntry[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isVotingEnabled, setIsVotingEnabled] = useState(false);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const [hasVotedAll, setHasVotedAll] = useState(false);
  const [challengeState, setChallengeState] =
    useState<ChallengeState>("submission");
  const { user } = useUser();

  useEffect(() => {
    checkChallengeStatus();
  }, []);

  useEffect(() => {
    if (isVotingEnabled) {
      fetchVotingPool();
    }
  }, [isVotingEnabled, user?.username]);

  const checkChallengeStatus = async () => {
    try {
      const response = await fetch("/api/pic-perfect/status");
      if (!response.ok) {
        throw new Error("Failed to fetch challenge status");
      }

      const data = await response.json();
      const state = data.challenge_state as ChallengeState;
      setChallengeState(state);
      setIsVotingEnabled(state === "voting");

      if (state !== "voting") {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error checking challenge status:", error);
      toast.error("Failed to check challenge status", {
        description: "Please refresh the page to try again",
      });
      setIsLoading(false);
    }
  };

  const fetchVotingPool = async () => {
    if (!user?.username) return;

    try {
      const response = await fetch("/api/pic-perfect/voting-pool", {
        headers: {
          "team-name": user.username,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch voting pool");
      }

      const data = await response.json();
      setVotingPool(data.voting_pool);
    } catch (error) {
      console.error("Error fetching voting pool:", error);
      toast.error("Failed to load submissions", {
        description: "Please refresh the page to try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (selectedTeams.length === 0) {
      toast.error("Please select at least one submission to vote for");
      return;
    }

    try {
      const response = await fetch("/api/pic-perfect/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "team-name": user?.username || "",
        },
        body: JSON.stringify({
          voted_teams: selectedTeams,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit votes");
      }

      const data = await response.json();
      setRemainingVotes(data.remaining_votes);
      setSelectedTeams([]);

      if (data.remaining_votes === 0) {
        setHasVotedAll(true);
      }
      toast.success(data.message || "Votes cast successfully!");
    } catch (error) {
      console.error("Error submitting votes:", error);
      toast.error("Failed to submit votes", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[120px] items-center justify-center">
          <TerminalLoading text="Loading submissions" />
        </div>
      );
    }

    if (!isVotingEnabled) {
      return (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Voting is not enabled. Please wait for the host to open voting.
          </p>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            Current Phase: {challengeState}
          </p>
        </div>
      );
    }

    if (votingPool.length === 0) {
      return (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No submissions available for voting yet.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {hasVotedAll ? (
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-muted-foreground">
              You have cast all your votes. Thank you for participating!
            </p>
          </div>
        ) : (
          <Button
            onClick={handleVoteSubmit}
            size="lg"
            className="text-lg"
            disabled={selectedTeams.length === 0}
          >
            Submit Votes ({selectedTeams.length}/{remainingVotes})
          </Button>
        )}
        <VotingGrid
          entries={votingPool}
          onSelectionChange={setSelectedTeams}
          maxSelections={remainingVotes}
          disabled={hasVotedAll}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto flex flex-col gap-6 p-6">
      <Card className="mx-auto w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="font-press-start-2p text-xl text-primary">
                Vote for the Best Recreation
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Vote for the team that best recreated the challenge image using
                AI. You can select up to {remainingVotes} submissions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
