"use client";

import { usePlusValueSimulation } from "@/hooks/use-plus-value-simulation";
import { PlusValueInputForm } from "@/components/simulator/plus-value/input-form";
import { PlusValueResultsPanel } from "@/components/simulator/plus-value/results-panel";

export default function PlusValueCessionPage() {
  const { input, updateField, result, loading, isValid } = usePlusValueSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Plus-Value de Cession</h1>
      <p className="mt-1 text-muted-foreground">
        Comparez flat tax 30% vs bareme progressif avec abattements PME et depart retraite.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <PlusValueInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <PlusValueResultsPanel input={input} result={result} loading={loading} isValid={isValid} />
        </div>
      </div>
    </div>
  );
}
