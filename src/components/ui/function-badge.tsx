import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FunctionBadgeProps {
  name: string;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function FunctionBadge({
  name,
  onRemove,
  onClick,
  className,
}: Readonly<FunctionBadgeProps>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full",
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80 transition-colors",
        "text-sm font-medium",
        "cursor-pointer select-none",
        "border border-transparent",
        "group",
        className
      )}
    >
      <span className="truncate max-w-[200px]" onClick={onClick}>
        {name}
      </span>
      {onRemove && (
        <X
          className="h-3 w-3 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </div>
  );
}
