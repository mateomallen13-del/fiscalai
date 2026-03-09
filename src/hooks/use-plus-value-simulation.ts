"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runPlusValueSimulation } from "@/lib/fiscal/plus-value-simulator";
import type { PlusValueInput, PlusValueResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: PlusValueInput = {
  prixAcquisition: 0,
  prixCession: 0,
  dureeDetention: 5,
  structure: "SAS",
  departRetraite: false,
  isPME: true,
  situationFamiliale: "celibataire",
};

export function usePlusValueSimulation() {
  const [input, setInput] = useState<PlusValueInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<PlusValueResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid =
    debouncedInput.prixCession > 0 &&
    debouncedInput.prixCession > debouncedInput.prixAcquisition;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const res = runPlusValueSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof PlusValueInput>(field: K, value: PlusValueInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
