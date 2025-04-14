"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImagePreview } from "./image-preview";
import { TerminalLoading } from "./terminal-loading";

interface SubmissionFormProps {
  isLoading: boolean;
  hasSubmitted: boolean;
  onSubmitSuccess: () => void;
}

export function SubmissionForm({
  isLoading,
  hasSubmitted,
  onSubmitSuccess,
}: SubmissionFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isImageError, setIsImageError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateBingImageUrl = (url: string) => {
    return url.startsWith("https://th.bing.com/th/id/");
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setIsValidUrl(url === "" || validateBingImageUrl(url));
    setIsImageError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBingImageUrl(imageUrl)) {
      toast.error("Please use a valid Bing image URL", {
        description: "The URL should start with 'https://th.bing.com/th/id/'",
      });
      return;
    }

    if (isImageError) {
      toast.error("Cannot submit with invalid image", {
        description: "Please verify the image URL is correct and accessible",
      });
      return;
    }

    if (!user?.username) {
      toast.error("User not found", {
        description: "Please make sure you are logged in",
      });
      return;
    }

    try {
      const response = await fetch("/api/pic-perfect/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "team-name": user.username,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit challenge");
      }

      toast.success("Challenge submitted!", {
        description: "Your entry has been recorded successfully.",
      });

      // Clear form and notify parent
      setImageUrl("");
      setPrompt("");
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting challenge:", error);
      toast.error("Failed to submit challenge", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    }
  };

  const handleImageError = () => {
    setIsImageError(true);
    toast.error("Failed to load image", {
      description:
        "Please verify that the Bing image URL is correct and accessible.",
      action: {
        label: "Retry",
        onClick: () => setIsImageError(false),
      },
    });
  };

  const renderFormContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[120px] items-center justify-center">
          <TerminalLoading text="Checking submission status" />
        </div>
      );
    }

    if (hasSubmitted) {
      return (
        <div className="rounded-lg bg-muted p-4 text-center text-muted-foreground">
          Your team has already submitted an entry for this challenge.
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-2">
          <Label htmlFor="imageUrl" className="text-base">
            Generated Image URL
          </Label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://th.bing.com/th/id/your-image-id"
            value={imageUrl}
            onChange={handleImageUrlChange}
            className={cn(
              "font-mono",
              !isValidUrl && "border-destructive focus-visible:ring-destructive"
            )}
            required
            aria-invalid={!isValidUrl}
          />
          {!isValidUrl && (
            <p className="text-sm text-destructive">
              Please enter a valid Bing image URL
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="prompt" className="text-base">
            Prompt
          </Label>
          <Textarea
            id="prompt"
            placeholder="Write the prompt that you used to create the image ..."
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setPrompt(e.target.value)
            }
            className="min-h-[120px] font-mono"
            required
          />
        </div>

        <Button
          type="submit"
          className="group mt-4 w-full text-lg font-semibold"
          disabled={!imageUrl || !prompt || !isValidUrl || isImageError}
        >
          <span className="group-hover:animate-pulse">
            &gt;_ Submit Challenge
          </span>
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {renderFormContent()}
      </form>

      {isMounted && imageUrl && (
        <ImagePreview
          imageUrl={imageUrl}
          onError={handleImageError}
          onLoad={() => setIsImageError(false)}
        />
      )}
    </div>
  );
}
