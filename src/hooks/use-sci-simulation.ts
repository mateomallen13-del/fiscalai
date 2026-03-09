"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runSciSimulation } from "@/lib/fiscal/sci-simulator";
import type { SciInput, SciResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: SciInput = {
  loyersAnnuels: 0,
  chargesExploitation: 0,
  interetsEmprunt: 0,
  travauxDeductibles: 0,
  amortissementAnnuel: 0,
  tauxCroissance: 2,
  situationFamiliale: "celibataire",
  partsSCI: 100,
};

export function useSciSimulation() {
  const [input, setInput] = useState<SciInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<SciResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid = debouncedInput.loyersAnnuels > 0;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const res = runSciSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof SciInput>(field: K, value: SciInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
