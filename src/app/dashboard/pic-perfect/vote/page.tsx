"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TerminalLoading } from "@/components/pic-perfect/terminal-loading";

export default function VotePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for now
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto flex flex-col gap-6 p-6">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="font-press-start-2p text-xl text-primary">
                Vote for the Best Recreation
              </CardTitle>
              <CardDescription className="mt-2">
                Vote for the team that best recreated the challenge image using
                AI. Choose wisely - you can only vote once!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-[120px] items-center justify-center">
              <TerminalLoading text="Loading submissions" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Voting content will go here */}
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                Voting interface coming soon...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
