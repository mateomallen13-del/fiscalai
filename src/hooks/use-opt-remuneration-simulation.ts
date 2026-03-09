"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runOptRemunerationSimulation } from "@/lib/fiscal/opt-remuneration-simulator";
import type { OptRemunerationInput, OptRemunerationResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: OptRemunerationInput = {
  beneficeSociete: 0,
  revenuCibleNet: 0,
  situationFamiliale: "celibataire",
};

export function useOptRemunerationSimulation() {
  const [input, setInput] = useState<OptRemunerationInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<OptRemunerationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid = debouncedInput.beneficeSociete > 0;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const res = runOptRemunerationSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof OptRemunerationInput>(field: K, value: OptRemunerationInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
