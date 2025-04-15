import { Badge } from "@/components/ui/badge";

export function SchemaDisplay({ schema }: { schema: any }) {
  // Function to clean up ref names
  const formatRef = (ref: string) => {
    if (!ref) return "Unknown";
    return ref
      .replace("#/$defs/", "")
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  // Extract a ref name from a full ref path
  const getRefName = (ref: string) => {
    return ref.replace("#/$defs/", "");
  };

  // Debug output to understand the schema structure
  console.log("Schema in SchemaDisplay:", JSON.stringify(schema, null, 2));

  return (
    <div className="text-xs space-y-3">
      {schema.description && (
        <div>
          <h4 className="font-medium mb-1">Description</h4>
          <p className="text-blue-400">{schema.description}</p>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-1">Parameters</h4>
        <div className="space-y-2">
          {Object.entries(schema.properties || {}).map(
            ([name, prop]: [string, any]) => (
              <div
                key={name}
                className="border border-slate-700 rounded-lg p-2 space-y-1"
              >
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-medium">{name}</span>
                  <Badge className="bg-emerald-500 text-black text-xs">
                    {prop.type}
                  </Badge>
                  {schema.required?.includes(name) && (
                    <Badge className="bg-red-600 text-xs">Required</Badge>
                  )}
                </div>

                {prop.items && (
                  <div className="pl-3 border-l border-slate-600 py-1">
                    <div className="text-slate-400 text-xs">Items:</div>

                    {/* Handle $ref in items */}
                    {prop.items.$ref && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className="bg-blue-800 border border-blue-500 text-xs">
                            {formatRef(prop.items.$ref)}
                          </Badge>
                        </div>

                        {/* Show the actual definition from $defs */}
                        {schema.$defs && (
                          <div className="border-l border-blue-600 pl-3 py-1">
                            {(() => {
                              const refName = getRefName(prop.items.$ref);
                              const definition = schema.$defs[refName];

                              if (!definition)
                                return (
                                  <div className="text-red-500 text-xs">
                                    Definition not found
                                  </div>
                                );

                              return (
                                <div className="space-y-1">
                                  {definition.description && (
                                    <p className="text-blue-400 text-xs">
                                      {definition.description}
                                    </p>
                                  )}

                                  <div className="space-y-1">
                                    {Object.entries(
                                      definition.properties || {}
                                    ).map(
                                      ([propName, propDef]: [string, any]) => (
                                        <div
                                          key={propName}
                                          className="border border-slate-800 rounded p-1"
                                        >
                                          <div className="flex items-center gap-1 flex-wrap">
                                            <span className="font-medium text-xs">
                                              {propName}
                                            </span>
                                            <Badge className="bg-purple-700 text-xs">
                                              {propDef.type}
                                            </Badge>
                                            {definition.required?.includes(
                                              propName
                                            ) && (
                                              <Badge className="bg-red-600 text-xs">
                                                Required
                                              </Badge>
                                            )}
                                          </div>
                                          {propDef.title && (
                                            <div className="text-slate-300 text-xs">
                                              {propDef.title}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Display all $defs section for reference - but more compact */}
      {schema.$defs && Object.keys(schema.$defs).length > 0 && (
        <div className="mt-2 border-t border-slate-700 pt-2">
          <h4 className="font-medium mb-1">Type Definitions</h4>
          <div className="space-y-2">
            {Object.entries(schema.$defs).map(
              ([defName, def]: [string, any]) => (
                <div
                  key={defName}
                  className="border border-slate-700 rounded-lg p-2"
                >
                  <div className="flex items-center gap-1 flex-wrap mb-1">
                    <span className="font-medium text-blue-400">{defName}</span>
                    <Badge>{def.type}</Badge>
                  </div>
                  {def.description && (
                    <p className="text-slate-300 text-xs">{def.description}</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {schema.additionalProperties === false && (
        <div className="text-blue-400 text-xs mt-2">
          Additional properties are not allowed
        </div>
      )}
    </div>
  );
}
