"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface VotingEntry {
  teamName: string;
  imageUrl: string;
}

interface VotingGridProps {
  entries: VotingEntry[];
  onSelectionChange?: (selectedTeams: string[]) => void;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
}

export function VotingGrid({
  entries,
  onSelectionChange,
  maxSelections = 3,
  disabled = false,
  className,
}: Readonly<VotingGridProps>) {
  const [selectedTeams, setSelectedTeams] = React.useState<Set<string>>(
    new Set()
  );
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());

  const handleSelect = (teamName: string) => {
    if (disabled) return;

    const newSelection = new Set(selectedTeams);

    if (!newSelection.has(teamName)) {
      if (newSelection.size >= maxSelections) {
        toast.error(`You can only select up to ${maxSelections} images`);
        return;
      }
      newSelection.add(teamName);
    } else {
      newSelection.delete(teamName);
    }

    setSelectedTeams(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const handleImageError = (teamName: string) => {
    setImageErrors((prev) => new Set(prev).add(teamName));
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        disabled && "opacity-50",
        className
      )}
    >
      {entries.map((entry) => {
        const isSelected = selectedTeams.has(entry.teamName);
        const hasError =
          imageErrors.has(entry.teamName) || !isValidUrl(entry.imageUrl);

        return (
          <div
            key={entry.teamName}
            className={cn(
              "group relative aspect-square cursor-pointer overflow-hidden border transition-all hover:ring-2 hover:ring-primary",
              isSelected && "ring-2 ring-primary",
              hasError && "ring-2 ring-destructive",
              disabled && "cursor-not-allowed"
            )}
            onClick={() => !hasError && handleSelect(entry.teamName)}
            role="button"
            tabIndex={disabled || hasError ? -1 : 0}
            onKeyDown={(e) => {
              if (
                !disabled &&
                !hasError &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                handleSelect(entry.teamName);
              }
            }}
          >
            {hasError ? (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Failed to load image
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Image
                  src={entry.imageUrl}
                  alt="Submission"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain"
                  priority={false}
                  draggable={false}
                  onError={() => handleImageError(entry.teamName)}
                />
                <div
                  className={cn(
                    "absolute inset-0 z-10 bg-black/50 transition-opacity",
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100",
                    disabled && "opacity-0 group-hover:opacity-0"
                  )}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
