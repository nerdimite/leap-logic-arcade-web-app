"use client";
import { Button } from "@/components/ui/button";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex h-screen w-full flex-col gap-5 items-center justify-center">
      <h1 className="text-4xl font-bold font-press-start-2p text-primary">
        Logic Arcade<span className="animate-caret-blink text-6xl">_</span>
      </h1>
      <Button
        size="lg"
        className="font-press-start-2p cursor-pointer hover:bg-accent hover:text-accent-foreground"
        onClick={() => router.push("/dashboard")}
      >
        &gt; Enter
      </Button>

      <RetroGrid darkLineColor="green" />
    </div>
  );
}
