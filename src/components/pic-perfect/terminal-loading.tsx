"use client";

import { useEffect, useState } from "react";

interface TerminalLoadingProps {
  text?: string;
}

export function TerminalLoading({ text = "Loading" }: TerminalLoadingProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-md">
      <span className="text-primary">&gt;_</span>{" "}
      <span className="text-muted-foreground">
        {text}
        <span className="inline-block min-w-[24px] text-left text-primary">{dots}</span>
      </span>
    </div>
  );
}
