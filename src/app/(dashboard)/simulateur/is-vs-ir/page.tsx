"use client";

import { useIsIrSimulation } from "@/hooks/use-is-ir-simulation";
import { IsIrInputForm } from "@/components/simulator/is-ir/input-form";
import { IsIrResultsPanel } from "@/components/simulator/is-ir/results-panel";

export default function IsVsIrPage() {
  const { input, updateField, result, loading, isValid } =
    useIsIrSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Simulation IS vs IR</h1>
      <p className="mt-1 text-muted-foreground">
        Comparez l&apos;imposition sur 3 ans avec dividendes et flat tax.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <IsIrInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <IsIrResultsPanel
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
