"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImagePreviewProps {
  imageUrl: string;
  onError: () => void;
  onLoad: () => void;
}

export function ImagePreview({ imageUrl, onError, onLoad }: ImagePreviewProps) {
  if (!imageUrl) return null;

  return (
    <Card className="mx-auto w-full max-w-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="font-press-start-2p text-lg text-secondary">
          Image Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="relative flex aspect-video items-center justify-center overflow-hidden p-0">
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-contain"
            onError={onError}
            onLoad={onLoad}
          />
        </div>
      </CardContent>
    </Card>
  );
}
