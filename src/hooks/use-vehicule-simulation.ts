"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runVehiculeSimulation } from "@/lib/fiscal/vehicule-simulator";
import type { VehiculeInput, VehiculeResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: VehiculeInput = {
  prixAchat: 0,
  emissionsCO2: 120,
  typeCarburant: "thermique",
  kmAnnuels: 20000,
  puissanceFiscale: 6,
  coutCarburantKm: 0.10,
  dureeUtilisation: 3,
  tauxAvantageNature: 9,
};

export function useVehiculeSimulation() {
  const [input, setInput] = useState<VehiculeInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<VehiculeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid = debouncedInput.prixAchat > 0 && debouncedInput.kmAnnuels > 0;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const res = runVehiculeSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof VehiculeInput>(field: K, value: VehiculeInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
