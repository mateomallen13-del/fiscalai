"use client";

import { useStatutsComparator } from "@/hooks/use-statuts-comparator";
import { StatutsInputForm } from "@/components/simulator/statuts/input-form";
import { StatutsResultsPanel } from "@/components/simulator/statuts/results-panel";

export default function ComparateurStatutsPage() {
  const { input, updateField, result, loading, isValid } =
    useStatutsComparator();

  return (
    <div>
      <h1 className="text-2xl font-bold">Comparateur de Statuts Juridiques</h1>
      <p className="mt-1 text-muted-foreground">
        Comparez EI, EURL, SASU et SAS avec les taux 2025.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <StatutsInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <StatutsResultsPanel
            input={input}
            result={result}
            loading={loading}
            isValid={isValid}
          />
        </div>
      </div>
    </div>
  );
}
