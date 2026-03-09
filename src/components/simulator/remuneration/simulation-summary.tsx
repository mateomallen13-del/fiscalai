import { ResultCard } from "@/components/simulator/shared/result-card";
import { formatCurrency } from "@/lib/formatters";
import type { SimulationResult } from "@/lib/fiscal/types";
import { Badge } from "@/components/ui/badge";

interface SimulationSummaryProps {
  result: SimulationResult;
}

export function SimulationSummary({ result }: SimulationSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Régime recommandé : {result.regimeRecommande}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Économie de {formatCurrency(result.economie)}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard
          label="Revenu total dirigeant (TNS)"
          value={formatCurrency(result.tns.revenuTotalDirigeant)}
          subtitle={`Net après IR : ${formatCurrency(result.tns.netApresIR)} + Dividendes nets : ${formatCurrency(result.tns.dividendes.montantNet)}`}
          variant={result.regimeRecommande === "TNS" ? "success" : "default"}
        />
        <ResultCard
          label="Revenu total dirigeant (SASU)"
          value={formatCurrency(result.sasu.revenuTotalDirigeant)}
          subtitle={`Net après IR : ${formatCurrency(result.sasu.netApresIR)} + Dividendes nets : ${formatCurrency(result.sasu.dividendes.montantNet)}`}
          variant={result.regimeRecommande === "SASU" ? "success" : "default"}
        />
      </div>
    </div>
  );
}
