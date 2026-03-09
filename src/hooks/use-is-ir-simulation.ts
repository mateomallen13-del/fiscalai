"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runIsIrSimulation } from "@/lib/fiscal/is-ir-simulator";
import type { IsIrInput, IsIrResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: IsIrInput = {
  beneficeAnnuel: 0,
  tauxCroissance: 5,
  remunerationBrute: 0,
  situationFamiliale: "celibataire",
  partDividendes: 100,
};

export function useIsIrSimulation() {
  const [input, setInput] = useState<IsIrInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<IsIrResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  const isValid =
    debouncedInput.beneficeAnnuel > 0 && debouncedInput.remunerationBrute > 0;

  useEffect(() => {
    if (!isValid) {
      setResult(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const res = runIsIrSimulation(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof IsIrInput>(field: K, value: IsIrInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
