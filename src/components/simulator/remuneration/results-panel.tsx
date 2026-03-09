"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimulationSummary } from "./simulation-summary";
import { ComparisonTable } from "./comparison-table";
import { ChargesBreakdown } from "./charges-breakdown";
import { ChartComparison } from "./chart-comparison";
import { Skeleton } from "@/components/ui/skeleton";
import { PdfExportButton } from "./pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import type { SimulationInput, SimulationResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: SimulationInput;
  result: SimulationResult | null;
  loading: boolean;
  isValid: boolean;
}

export function ResultsPanel({ input, result, loading, isValid }: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>
          Renseignez le chiffre d&apos;affaires et la rémunération pour voir les
          résultats.
        </p>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="results-panel">
      <SimulationSummary result={result} />

      <Tabs defaultValue="comparaison">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparaison">Comparaison</TabsTrigger>
          <TabsTrigger value="charges">Détail charges</TabsTrigger>
          <TabsTrigger value="graphiques">Graphiques</TabsTrigger>
        </TabsList>

        <TabsContent value="comparaison" className="mt-4">
          <ComparisonTable result={result} />
        </TabsContent>

        <TabsContent value="charges" className="mt-4">
          <ChargesBreakdown result={result} />
        </TabsContent>

        <TabsContent value="graphiques" className="mt-4">
          <ChartComparison result={result} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton
          type="remuneration_dirigeant"
          inputData={input}
          resultData={result}
        />
        <PdfExportButton
          reportTitle="Simulation Rémunération Dirigeant"
          filename="simulation-remuneration-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
