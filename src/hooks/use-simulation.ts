"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runSimulation } from "@/lib/fiscal/simulation-engine";
import type { SimulationInput, SimulationResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: SimulationInput = {
  chiffreAffairesHT: 0,
  chargesExploitation: 0,
  remunerationBrute: 0,
  situationFamiliale: "celibataire",
  ageDirigeant: 40,
};

export function useSimulation() {
  const [input, setInput] = useState<SimulationInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid =
    debouncedInput.chiffreAffairesHT > 0 &&
    debouncedInput.remunerationBrute > 0;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    // Simulate async feel for loading state
    const timer = setTimeout(() => {
      const res = runSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof SimulationInput>(field: K, value: SimulationInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    input,
    setInput,
    updateField,
    result,
    loading,
    isValid,
  };
}
