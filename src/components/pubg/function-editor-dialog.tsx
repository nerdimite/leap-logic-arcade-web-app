import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SchemaViewer } from "./schema-viewer";

interface Tool {
  name: string;
  description: string;
  type: string;
  strict: boolean;
  parameters: {
    description: string;
    properties: {
      [key: string]: {
        type: string;
        title?: string;
        description?: string;
        items?: unknown;
        anyOf?: unknown[];
      };
    };
    required: string[];
    title: string;
    type: string;
    additionalProperties: boolean;
  };
}

interface FunctionEditorDialogProps {
  tool: Tool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tool: Tool) => Promise<void>;
  teamName: string;
}

export function FunctionEditorDialog({
  tool,
  open,
  onOpenChange,
  onSave,
  teamName,
}: Readonly<FunctionEditorDialogProps>) {
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Reset description when dialog opens/closes or tool changes
  useEffect(() => {
    if (tool && open) {
      setDescription(tool.description || "");
    } else if (!open) {
      setDescription("");
    }
  }, [tool, open]);

  const handleSave = async () => {
    if (!tool) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/pubg/agent/tool", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "team-name": teamName,
        },
        body: JSON.stringify({
          tool_name: tool.name,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update tool");
      }

      // Update the tool with the new description since the update was successful
      await onSave({
        ...tool,
        description: description.trim(),
      });

      toast.success("Function updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving function:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update function"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!tool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Function: {tool.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] max-h-[200px] resize-none text-base"
              placeholder="Enter function description..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Schema</Label>
            <div className="rounded-md border p-4">
              <SchemaViewer parameters={tool.parameters} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
