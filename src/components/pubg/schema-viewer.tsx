import { Badge } from "@/components/ui/badge";

interface SchemaProperty {
  type: string;
  title?: string;
  description?: string;
  items?: unknown;
  anyOf?: unknown[];
}

interface SchemaParameters {
  description: string;
  properties: {
    [key: string]: SchemaProperty;
  };
  required: string[];
  title: string;
  type: string;
  additionalProperties: boolean;
}

interface SchemaViewerProps {
  parameters: SchemaParameters;
}

export function SchemaViewer({ parameters }: SchemaViewerProps) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-medium mb-1">Description</h4>
        <p className="text-muted-foreground">{parameters.description}</p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Parameters</h4>
        <div className="space-y-3">
          {Object.entries(parameters.properties).map(([name, prop]) => (
            <div key={name} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{name}</span>
                <Badge
                  variant={
                    parameters.required.includes(name) ? "default" : "secondary"
                  }
                >
                  {prop.type}
                </Badge>
                {parameters.required.includes(name) && (
                  <Badge variant="destructive">Required</Badge>
                )}
              </div>
              {prop.description && (
                <p className="text-muted-foreground text-sm">
                  {prop.description}
                </p>
              )}
              {prop.items && (
                <div className="pl-4 border-l-2">
                  <span className="text-muted-foreground">Items: </span>
                  <pre className="text-xs mt-1">
                    {JSON.stringify(prop.items, null, 2)}
                  </pre>
                </div>
              )}
              {prop.anyOf && (
                <div className="pl-4 border-l-2">
                  <span className="text-muted-foreground">Any of: </span>
                  <pre className="text-xs mt-1">
                    {JSON.stringify(prop.anyOf, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {parameters.additionalProperties === false && (
        <div className="text-muted-foreground text-xs">
          Additional properties are not allowed
        </div>
      )}
    </div>
  );
}
