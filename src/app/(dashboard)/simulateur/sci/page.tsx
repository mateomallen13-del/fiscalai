"use client";

import { useSciSimulation } from "@/hooks/use-sci-simulation";
import { SciInputForm } from "@/components/simulator/sci/input-form";
import { SciResultsPanel } from "@/components/simulator/sci/results-panel";

export default function SciPage() {
  const { input, updateField, result, loading, isValid } = useSciSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Simulateur SCI</h1>
      <p className="mt-1 text-muted-foreground">
        Comparez SCI a l&apos;IR vs SCI a l&apos;IS avec projection sur 3 ans.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SciInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <SciResultsPanel
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
