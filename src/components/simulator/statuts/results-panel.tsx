"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { StatutCard } from "./statut-card";
import { StatutsComparisonChart } from "./comparison-chart";
import { Recommendation } from "./recommendation";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import type { StatutsInput, StatutsResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: StatutsInput;
  result: StatutsResult | null;
  loading: boolean;
  isValid: boolean;
}

export function StatutsResultsPanel({
  input,
  result,
  loading,
  isValid,
}: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>
          Renseignez le chiffre d&apos;affaires et la rémunération pour
          comparer les statuts.
        </p>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="results-panel">
      <Recommendation result={result} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {result.statuts.map((statut) => (
          <StatutCard
            key={statut.statut}
            result={statut}
            isRecommended={statut.statut === result.recommandation.statut}
          />
        ))}
      </div>

      <StatutsComparisonChart result={result} />

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton
          type="comparateur_statuts"
          inputData={input}
          resultData={result}
        />
        <PdfExportButton
          data={{ type: "comparateur_statuts", result }}
          reportTitle="Comparaison des Statuts Juridiques"
          filename="comparateur-statuts-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
