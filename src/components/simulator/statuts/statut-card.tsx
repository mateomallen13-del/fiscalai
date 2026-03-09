import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import type { StatutResult } from "@/lib/fiscal/types";

interface StatutCardProps {
  result: StatutResult;
  isRecommended: boolean;
}

export function StatutCard({ result, isRecommended }: StatutCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        isRecommended && "border-green-300 ring-1 ring-green-300"
      )}
    >
      {isRecommended && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-green-500 px-2.5 py-1 text-xs font-medium text-white">
          Recommandé
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{result.label}</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {result.imposition.type === "IS" ? "Impôt sur les sociétés" : "Impôt sur le revenu"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Net disponible */}
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">Net disponible dirigeant</p>
          <p
            className={cn(
              "text-2xl font-bold",
              isRecommended ? "text-green-600" : ""
            )}
          >
            {formatCurrency(result.netDisponible)}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <Row label="Charges sociales" value={formatCurrency(result.chargesSociales)} />
          <Row
            label="Taux de charges"
            value={formatPercent(result.tauxCharges)}
          />
          <div className="my-2 border-t" />
          {result.imposition.type === "IS" && (
            <>
              <Row label="Impôt sociétés (IS)" value={formatCurrency(result.imposition.montantIS)} />
              <Row label="Impôt revenu (IR)" value={formatCurrency(result.imposition.montantIR)} />
              <Row
                label="Dividendes nets"
                value={formatCurrency(result.imposition.dividendesNets)}
              />
            </>
          )}
          {result.imposition.type === "IR" && (
            <Row label="Impôt revenu (IR)" value={formatCurrency(result.imposition.montantIR)} />
          )}
          <div className="my-2 border-t" />
          <Row label="Coût total entreprise" value={formatCurrency(result.coutTotalEntreprise)} />
        </div>

        {/* Protection sociale */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Protection sociale
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <ProtectionItem
              label="Retraite"
              level={result.protectionSociale.retraite}
            />
            <ProtectionItem
              label="Prévoyance"
              level={result.protectionSociale.prevoyance}
            />
            <BoolItem
              label="Indemnités jour."
              value={result.protectionSociale.indemniteJournaliere}
            />
            <BoolItem
              label="Chômage"
              value={result.protectionSociale.assuranceChomage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ProtectionItem({
  label,
  level,
}: {
  label: string;
  level: "Faible" | "Moyenne" | "Bonne";
}) {
  const color =
    level === "Bonne"
      ? "text-green-600"
      : level === "Moyenne"
        ? "text-orange-500"
        : "text-red-500";
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn("font-medium", color)}>{level}</span>
    </div>
  );
}

function BoolItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground">{label}:</span>
      {value ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <X className="h-3.5 w-3.5 text-red-500" />
      )}
    </div>
  );
}
