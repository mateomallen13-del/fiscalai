"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import { runStatutsComparison } from "@/lib/fiscal/statuts-comparator";
import type { StatutsInput, StatutsResult } from "@/lib/fiscal/types";

const DEFAULT_INPUT: StatutsInput = {
  chiffreAffairesHT: 0,
  chargesExploitation: 0,
  remunerationBrute: 0,
  situationFamiliale: "celibataire",
};

export function useStatutsComparator() {
  const [input, setInput] = useState<StatutsInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<StatutsResult | null>(null);
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
    const timer = setTimeout(() => {
      const res = runStatutsComparison(debouncedInput);
      setResult(res);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [debouncedInput, isValid]);

  const updateField = useCallback(
    <K extends keyof StatutsInput>(field: K, value: StatutsInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { input, updateField, result, loading, isValid };
}
