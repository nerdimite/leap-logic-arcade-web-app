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
import { SubmissionForm } from "@/components/pic-perfect/submission-form";

export default function SubmitPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    checkTeamStatus();
  }, [user?.username]);

  const checkTeamStatus = async () => {
    if (!user?.username) return;

    try {
      const response = await fetch("/api/pic-perfect/team-status", {
        headers: {
          "team-name": user.username,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch team status");
      }

      const data = await response.json();
      setHasSubmitted(data.has_submitted);
    } catch (error) {
      console.error("Error checking team status:", error);
      toast.error("Failed to check team status", {
        description: "Please refresh the page to try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-6 p-6">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="font-press-start-2p text-xl text-primary">
                Submit Your Entry
              </CardTitle>
              <CardDescription className="mt-2">
                Submit your recreated image&apos;s bing image url and the prompt
                that you used to create it.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SubmissionForm
            isLoading={isLoading}
            hasSubmitted={hasSubmitted}
            onSubmitSuccess={() => setHasSubmitted(true)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
