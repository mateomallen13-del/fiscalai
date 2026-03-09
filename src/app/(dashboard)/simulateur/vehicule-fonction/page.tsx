"use client";

import { useVehiculeSimulation } from "@/hooks/use-vehicule-simulation";
import { VehiculeInputForm } from "@/components/simulator/vehicule/input-form";
import { VehiculeResultsPanel } from "@/components/simulator/vehicule/results-panel";

export default function VehiculeFonctionPage() {
  const { input, updateField, result, loading, isValid } =
    useVehiculeSimulation();

  return (
    <div>
      <h1 className="text-2xl font-bold">Vehicule de Fonction</h1>
      <p className="mt-1 text-muted-foreground">
        Comparez vehicule personnel (IK) vs vehicule de societe avec TVS 2025.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <VehiculeInputForm input={input} updateField={updateField} />
        </div>
        <div>
          <VehiculeResultsPanel
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
