"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chat, ChatMessage } from "@/components/pubg/chat";
import { toast } from "sonner";

// Define the API response format
interface ApiMessage {
  role: "system" | "user" | "assistant";
  content: string;
  type?: string;
}

export default function MissionPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Load chat history on component mount
  useEffect(() => {
    if (user?.username) {
      fetchChatHistory();
    }
  }, [user?.username]);

  // Convert API message format to our ChatMessage format
  const convertApiMessages = (apiMessages: ApiMessage[]): ChatMessage[] => {
    return apiMessages.map((msg, index) => ({
      id: `msg-${index}-${Date.now()}`,
      content: msg.content,
      sender:
        msg.role === "assistant"
          ? "ai"
          : msg.role === "user"
          ? "user"
          : "system",
      timestamp: new Date().toISOString(),
    }));
  };

  const fetchChatHistory = async () => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/pubg/agent/chat", {
        headers: {
          "team-name": user.username || "anonymous",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data = await response.json();
      // API returns an array of messages directly
      if (Array.isArray(data)) {
        setMessages(convertApiMessages(data));
      } else if (data.messages && Array.isArray(data.messages)) {
        // Fallback for different API format
        setMessages(convertApiMessages(data.messages));
      } else {
        console.error("Unexpected response format:", data);
        toast.error("Received invalid response format from the server");
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast.error("Failed to fetch chat history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user?.username) {
      toast.error("User information not available");
      return;
    }

    // Add user message to local chat (optimistic update)
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/pubg/agent/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "team-name": user.username || "anonymous",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Refresh the chat history to get the AI's response
      await fetchChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Remove the optimistic update since it failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

      // Add error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "Sorry, there was an error processing your request.",
        sender: "system",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Empty Card for now */}
        <Card className="flex h-[80vh] flex-col">
          <CardHeader>
            <CardTitle className="font-press-start-2p text-xl text-primary">
              AI Agent Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-6">
            {/* Empty for now, will be filled later */}
          </CardContent>
        </Card>

        {/* Right Column - Chat Interface */}
        <Card className="flex h-[80vh] flex-col">
          <CardHeader>
            <CardTitle className="font-press-start-2p text-xl text-primary">
              Communication Channel
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
