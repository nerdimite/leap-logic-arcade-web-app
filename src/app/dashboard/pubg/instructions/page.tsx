"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Separator } from "@/components/ui/separator";

export default function InstructionsPage() {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the markdown file content
    fetch("/available_tools.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        return response.text();
      })
      .then((content) => {
        setMarkdownContent(content);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading markdown file:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Instructions</h1>
      <Separator className="mb-6" />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse">Loading instructions...</div>
        </div>
      ) : (
        <div className="markdown-content text-foreground">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => <p className="my-3">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc pl-6 my-3">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 my-3">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-3 rounded-md my-4 overflow-x-auto text-sm">
                  {children}
                </pre>
              ),
            }}
          >
            {markdownContent}
          </Markdown>
        </div>
      )}
    </div>
  );
}
