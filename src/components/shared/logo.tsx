import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">F</span>
      </div>
      <span className="text-xl font-bold tracking-tight">
        Fiscal<span className="text-blue-600">AI</span>
      </span>
    </Link>
  );
}
