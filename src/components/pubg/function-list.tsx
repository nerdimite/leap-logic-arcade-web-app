import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FunctionBadge } from "@/components/ui/function-badge";
import { FunctionEditorDialog } from "./function-editor-dialog";
import { SchemaDisplay } from "./schema-display";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface FunctionListProps {
  teamName: string;
}

export function FunctionList({ teamName }: Readonly<FunctionListProps>) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAddingTool, setIsAddingTool] = useState(false);

  useEffect(() => {
    fetchTools();
    fetchAvailableTools();
  }, [teamName]);

  const fetchTools = async () => {
    if (!teamName) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/pubg/agent/tool", {
        headers: {
          "team-name": teamName,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tools");
      }

      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to load functions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableTools = async () => {
    try {
      const response = await fetch("/api/pubg/agent/available-tools", {
        headers: {
          "team-name": teamName,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available tools");
      }

      const data = await response.json();
      setAvailableTools(data);
    } catch (error) {
      console.error("Error fetching available tools:", error);
      toast.error("Failed to load available functions");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toolToDelete) return;

    try {
      const response = await fetch(
        `/api/pubg/agent/tool/${toolToDelete.name}`,
        {
          method: "DELETE",
          headers: {
            "team-name": teamName,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete function");
      }

      toast.success(`Function ${toolToDelete.name} deleted successfully`);
      // Refresh the tools list
      fetchTools();
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast.error(`Failed to delete function ${toolToDelete.name}`);
    } finally {
      setToolToDelete(null);
    }
  };

  const handleSaveFunction = async (updatedTool: Tool) => {
    try {
      const response = await fetch("/api/pubg/agent/tool", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "team-name": teamName,
        },
        body: JSON.stringify({
          tool_name: updatedTool.name,
          description: updatedTool.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update function");
      }

      toast.success(`Function ${updatedTool.name} updated successfully`);
      // Refresh the tools list
      fetchTools();
    } catch (error) {
      console.error("Error updating tool:", error);
      toast.error(`Failed to update function ${updatedTool.name}`);
      throw error;
    }
  };

  const handleAddTool = async () => {
    if (!selectedTool || !newDescription) {
      toast.error("Please select a function and provide a description");
      return;
    }

    setIsAddingTool(true);
    try {
      const response = await fetch("/api/pubg/agent/tool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "team-name": teamName,
        },
        body: JSON.stringify({
          tool_name: selectedTool,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add function");
      }

      toast.success("Function added successfully");
      setIsAddDialogOpen(false);
      setSelectedTool("");
      setNewDescription("");
      // Refresh the tools list
      fetchTools();
    } catch (error) {
      console.error("Error adding tool:", error);
      toast.error("Failed to add function");
    } finally {
      setIsAddingTool(false);
    }
  };

  // Update description when a tool is selected
  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    const selectedToolData = availableTools.find(
      (tool) => tool.name === toolName
    );
    if (selectedToolData) {
      setNewDescription(selectedToolData.description);
    }
  };

  const selectedToolData = availableTools.find(
    (tool) => tool.name === selectedTool
  );

  // Filter out tools that are already added
  const availableToolsFiltered = availableTools.filter(
    (availableTool: Tool) =>
      !tools.some((tool) => tool.name === availableTool.name)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Functions</h3>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            if (availableToolsFiltered.length === 0) {
              toast.info("All available functions have been added");
              return;
            }
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[50px] border rounded-md p-2">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading functions...
          </div>
        ) : tools.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No functions available
          </div>
        ) : (
          tools.map((tool) => (
            <FunctionBadge
              key={tool.name}
              name={tool.name}
              onClick={() => setToolToEdit(tool)}
              onRemove={() => setToolToDelete(tool)}
            />
          ))
        )}
      </div>

      <AlertDialog
        open={!!toolToDelete}
        onOpenChange={() => setToolToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Function</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the function &quot;
              {toolToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FunctionEditorDialog
        tool={toolToEdit}
        open={!!toolToEdit}
        onOpenChange={(open) => !open && setToolToEdit(null)}
        onSave={handleSaveFunction}
        teamName={teamName}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Function</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="function">Select Function</Label>
              <Select value={selectedTool} onValueChange={handleToolSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a function" />
                </SelectTrigger>
                <SelectContent>
                  {availableToolsFiltered.length === 0 ? (
                    <SelectItem value="no-functions-available" disabled>
                      No more functions available
                    </SelectItem>
                  ) : (
                    availableToolsFiltered.map((tool) => (
                      <SelectItem
                        key={tool.name}
                        value={tool.name}
                        className="text-base"
                      >
                        {tool.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter function description..."
                className="min-h-[80px] max-h-[120px] resize-none text-base"
              />
            </div>
            {selectedToolData && (
              <div className="grid gap-2">
                <Label>Schema</Label>
                <div className="rounded-md border p-4 max-h-[300px] overflow-y-auto">
                  <SchemaDisplay schema={selectedToolData.parameters} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-shrink-0 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedTool("");
                setNewDescription("");
              }}
              disabled={isAddingTool}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTool}
              disabled={isAddingTool || !selectedTool || !newDescription}
            >
              {isAddingTool ? "Adding..." : "Add Function"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
