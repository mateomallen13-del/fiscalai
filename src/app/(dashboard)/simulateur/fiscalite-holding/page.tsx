"use client";

import { useHoldingSimulation } from "@/hooks/use-holding-simulation";
import { HoldingInputForm } from "@/components/simulator/holding/input-form";
import { HoldingResultsPanel } from "@/components/simulator/holding/results-panel";

export default function FiscaliteHoldingPage() {
  const { input, updateField, result, loading, isValid } =
    useHoldingSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Fiscalite Holding</h1>
      <p className="mt-1 text-muted-foreground">
        Optimisez avec le regime mere-fille (95% d&apos;exoneration sur dividendes).
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <HoldingInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <HoldingResultsPanel
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
