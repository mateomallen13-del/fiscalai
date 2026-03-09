"use client";

import { useOptRemunerationSimulation } from "@/hooks/use-opt-remuneration-simulation";
import { OptRemunerationInputForm } from "@/components/simulator/opt-remuneration/input-form";
import { OptRemunerationResultsPanel } from "@/components/simulator/opt-remuneration/results-panel";

export default function OptimisationRemunerationPage() {
  const { input, updateField, result, loading, isValid } = useOptRemunerationSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Optimisation Remuneration</h1>
      <p className="mt-1 text-muted-foreground">
        Trouvez la repartition optimale entre salaire et dividendes pour maximiser votre revenu net.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <OptRemunerationInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <OptRemunerationResultsPanel input={input} result={result} loading={loading} isValid={isValid} />
        </div>
      </div>
    </div>
  );
}
