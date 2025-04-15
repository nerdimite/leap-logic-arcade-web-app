import { Badge } from "@/components/ui/badge";

interface SchemaProperty {
  type: string;
  title?: string;
  description?: string;
  items?: {
    $ref?: string;
    type?: string;
    properties?: Record<string, SchemaProperty>;
    required?: string[];
  };
  properties?: Record<string, SchemaProperty>;
  required?: string[];
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

interface PropertyViewerProps {
  name: string;
  property: SchemaProperty;
  required: string[];
  level?: number;
}

function formatRef(ref: string) {
  // Remove the #/$defs/ prefix and format nicely
  return ref
    .replace("#/$defs/", "")
    .replace(/([A-Z])/g, " $1")
    .trim();
}

function PropertyViewer({
  name,
  property,
  required,
  level = 0,
}: PropertyViewerProps) {
  const isRequired = required.includes(name);
  const indent = level * 16; // 16px indent per level

  return (
    <div className="space-y-2" style={{ marginLeft: `${indent}px` }}>
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        <Badge variant={isRequired ? "default" : "secondary"}>
          {property.type}
        </Badge>
        {isRequired && <Badge variant="destructive">Required</Badge>}
      </div>
      {property.description && (
        <p className="text-muted-foreground text-sm">{property.description}</p>
      )}
      {property.properties && (
        <div className="pl-4 border-l-2 pt-2 space-y-3">
          {Object.entries(property.properties).map(([propName, prop]) => (
            <PropertyViewer
              key={propName}
              name={propName}
              property={prop}
              required={property.required || []}
              level={level + 1}
            />
          ))}
        </div>
      )}
      {property.items && (
        <div className="pl-4 border-l-2 space-y-1">
          <span className="text-muted-foreground">Items: </span>
          {property.items.$ref ? (
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{formatRef(property.items.$ref)}</Badge>
            </div>
          ) : property.items.type ? (
            <Badge variant="outline">{property.items.type}</Badge>
          ) : null}
          {property.items.properties && (
            <div className="pt-2 space-y-3">
              {Object.entries(property.items.properties).map(
                ([propName, prop]) => (
                  <PropertyViewer
                    key={propName}
                    name={propName}
                    property={prop}
                    required={property.items?.required || []}
                    level={level + 1}
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
      {property.anyOf && (
        <div className="pl-4 border-l-2 space-y-1">
          <span className="text-muted-foreground">Any of: </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {property.anyOf.map((option: any, index) => (
              <Badge key={index} variant="outline">
                {option.type ||
                  (option.$ref && formatRef(option.$ref)) ||
                  "unknown"}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
            <div key={name} className="border rounded-lg p-3">
              <PropertyViewer
                name={name}
                property={prop}
                required={parameters.required}
              />
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
