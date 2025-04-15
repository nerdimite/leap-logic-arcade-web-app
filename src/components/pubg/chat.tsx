"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TerminalLoading } from "@/components/pic-perfect/terminal-loading";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai" | "system";
  timestamp: string;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function Chat({
  messages,
  onSendMessage,
  isLoading = false,
}: Readonly<ChatProps>) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  // Filter out system messages
  const visibleMessages = messages.filter((msg) => msg.sender !== "system");

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {visibleMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <TerminalLoading text="Agent is typing" />
            </div>
          )}
          {/* Empty div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-primary"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: Readonly<{ message: ChatMessage }>) {
  const getBubbleStyle = (sender: string) => {
    if (sender === "user") return "ml-auto bg-secondary text-secondary-foreground";
    if (sender === "ai")
      return "mr-auto bg-primary text-primary-foreground";
    return "mx-auto bg-muted text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "flex max-w-[80%] flex-col rounded-lg px-4 py-2",
        getBubbleStyle(message.sender)
      )}
    >
      <div className="break-words">{message.content}</div>
      <div
        className={cn(
          "mt-1 text-xs opacity-70",
          message.sender === "user" ? "text-right" : "text-left"
        )}
      >
        &gt;_
      </div>
    </div>
  );
}
