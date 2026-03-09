"use client";

import { useSimulation } from "@/hooks/use-simulation";
import { InputForm } from "@/components/simulator/remuneration/input-form";
import { ResultsPanel } from "@/components/simulator/remuneration/results-panel";

export default function RemunerationDirigeantPage() {
  const { input, updateField, result, loading, isValid } = useSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Simulateur Rémunération Dirigeant</h1>
      <p className="mt-1 text-muted-foreground">
        Comparez TNS (EURL) vs Assimilé salarié (SASU) avec les taux 2025.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <InputForm input={input} updateField={updateField} />
        </div>
        <div>
          <ResultsPanel input={input} result={result} loading={loading} isValid={isValid} />
        </div>
      </div>
    </div>
  );
}
