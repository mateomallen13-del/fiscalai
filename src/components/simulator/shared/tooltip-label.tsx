import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipLabelProps {
  htmlFor: string;
  label: string;
  tooltip: string;
}

export function TooltipLabel({ htmlFor, label, tooltip }: TooltipLabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      <Tooltip>
        <TooltipTrigger
          render={<Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />}
        />
        <TooltipContent side="right" className="max-w-[250px]">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
