import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FunctionList } from "./function-list";

interface AgentEditorProps {
  teamName: string;
}

export function AgentEditor({ teamName }: Readonly<AgentEditorProps>) {
  const [systemMessage, setSystemMessage] = useState("");
  const [temperature, setTemperature] = useState([0.7]); // Slider uses array values
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial state
  useEffect(() => {
    const fetchAgentState = async () => {
      try {
        const response = await fetch("/api/pubg/agent/state", {
          headers: {
            "team-name": teamName,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch agent state");
        }

        const data = await response.json();
        setSystemMessage(data.instructions || "");
        setTemperature([Number(data.temperature) || 0.7]);
      } catch (error) {
        console.error("Error fetching agent state:", error);
        toast.error("Failed to load agent configuration");
      }
    };

    if (teamName) {
      fetchAgentState();
    }
  }, [teamName]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pubg/agent/state", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "team-name": teamName,
        },
        body: JSON.stringify({
          system_message: systemMessage,
          temperature: temperature[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update agent state");
      }

      toast.success("Agent configuration saved successfully");
    } catch (error) {
      console.error("Error updating agent state:", error);
      toast.error("Failed to save agent configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="system-message" className="text-base">
          System Message
        </Label>
        <Textarea
          id="system-message"
          placeholder="Enter the system message for the AI agent..."
          value={systemMessage}
          onChange={(e) => setSystemMessage(e.target.value)}
          className="h-32 resize-none text-base border border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="temperature" className="text-base">
          Temperature: {temperature[0].toFixed(2)}
        </Label>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.01}
          value={temperature}
          onValueChange={setTemperature}
        />
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Configuration"}
      </Button>

      <div className="h-px bg-border" />

      <FunctionList teamName={teamName} />
    </div>
  );
}
