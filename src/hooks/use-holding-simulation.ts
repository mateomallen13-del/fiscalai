"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runHoldingSimulation } from "@/lib/fiscal/holding-simulator";
import type { HoldingInput, HoldingResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: HoldingInput = {
  beneficeFiliale: 0,
  remunerationGerant: 0,
  dividendesVersesHolding: 100,
  chargesHolding: 5000,
  situationFamiliale: "celibataire",
  remunerationDepuisHolding: 0,
};

export function useHoldingSimulation() {
  const [input, setInput] = useState<HoldingInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<HoldingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid =
    debouncedInput.beneficeFiliale > 0 && debouncedInput.remunerationGerant > 0;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const res = runHoldingSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof HoldingInput>(field: K, value: HoldingInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
