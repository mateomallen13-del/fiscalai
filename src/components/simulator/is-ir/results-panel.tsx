"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ResultCard } from "@/components/simulator/shared/result-card";
import { YearChart } from "./year-chart";
import { SummaryTable } from "./summary-table";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import { formatCurrency } from "@/lib/formatters";
import type { IsIrInput, IsIrResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: IsIrInput;
  result: IsIrResult | null;
  loading: boolean;
  isValid: boolean;
}

export function IsIrResultsPanel({
  input,
  result,
  loading,
  isValid,
}: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>
          Renseignez le bénéfice annuel et la rémunération pour lancer la
          simulation.
        </p>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="results-panel">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Régime recommandé"
          value={result.regimeRecommande === "IS" ? "Impôt Sociétés" : "Impôt Revenu"}
          subtitle="Sur 3 ans cumulés"
          variant="success"
        />
        <ResultCard
          label="Cumul IS (3 ans)"
          value={formatCurrency(result.cumulIS)}
          subtitle="Revenu total dirigeant"
        />
        <ResultCard
          label="Cumul IR (3 ans)"
          value={formatCurrency(result.cumulIR)}
          subtitle="Revenu total dirigeant"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Badge className="bg-green-500 hover:bg-green-600">
          {result.regimeRecommande}
        </Badge>
        <p className="text-sm">
          Le régime{" "}
          <strong>
            {result.regimeRecommande === "IS"
              ? "Impôt sur les Sociétés"
              : "Impôt sur le Revenu"}
          </strong>{" "}
          vous fait économiser{" "}
          <strong>{formatCurrency(result.economie)}</strong> sur 3 ans.
        </p>
      </div>

      <YearChart result={result} />
      <SummaryTable result={result} />

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton
          type="is_vs_ir"
          inputData={input}
          resultData={result}
        />
        <PdfExportButton
          reportTitle="Simulation IS vs IR — Projection 3 ans"
          filename="simulation-is-vs-ir-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
