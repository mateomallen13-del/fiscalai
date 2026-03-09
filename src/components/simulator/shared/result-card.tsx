import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: "default" | "success" | "warning";
}

export function ResultCard({
  label,
  value,
  subtitle,
  variant = "default",
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "success" && "border-green-200 bg-green-50",
        variant === "warning" && "border-orange-200 bg-orange-50"
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
