import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Card */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="font-press-start-2p text-2xl text-primary">
            Welcome to Logic Arcade!
          </CardTitle>
          <CardDescription className="mt-2 text-lg">
            Your gateway to exciting coding challenges and algorithmic
            adventures. Choose your challenge and start your journey to becoming
            a coding champion!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Challenge Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pic Perfect Challenge */}
        <Card className="group relative overflow-hidden transition-all hover:border-primary">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              📸
              <CardTitle className="font-press-start-2p">
                Pic Perfect Challenge
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              Test your image prompting skills and create a prompt that matches
              the provided image. Get as close as possible to the provided
              image and deceive other teams into thinking your image is the original.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Features:
                <ul className="ml-4 mt-1 list-disc">
                  <li>Prompt Engineering</li>
                  <li>Deception</li>
                  <li>Community Voting</li>
                </ul>
              </div>
              <Button asChild className="mt-4 w-full group-hover:bg-primary">
                <Link
                  href="/dashboard/pic-perfect/submit"
                  className="flex items-center justify-center gap-2"
                >
                  Start Challenge
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* P.U.B.G Challenge */}
        <Card className="group relative overflow-hidden transition-all hover:border-primary">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              🤖
              <CardTitle className="font-press-start-2p">
                P.U.B.G. Challenge
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              Prompt Utility Battle Ground: Prompt your way through
              fixing a spaceship and saving it from a crash.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Features:
                <ul className="ml-4 mt-1 list-disc">
                  <li>Prompt Engineering</li>
                  <li>Agentic AI</li>
                  <li>Reasoning and Planning</li>
                </ul>
              </div>
              <Button asChild className="mt-4 w-full group-hover:bg-primary">
                <Link
                  href="/dashboard/pubg/mission"
                  className="flex items-center justify-center gap-2"
                >
                  Start Challenge
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
