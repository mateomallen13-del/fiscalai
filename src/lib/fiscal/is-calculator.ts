import { IS_BRACKETS_2025 } from "./constants";
import type { ISResult } from "./types";

export function calculateIS(beneficeImposable: number): ISResult {
  const base = Math.max(0, beneficeImposable);
  let montant = 0;

  for (const bracket of IS_BRACKETS_2025) {
    if (base <= bracket.min) break;
    const taxableInBracket = Math.min(base, bracket.max) - bracket.min;
    montant += taxableInBracket * bracket.rate;
  }

  montant = Math.round(montant);
  const tauxEffectif = base > 0 ? montant / base : 0;

  return {
    beneficeImposable: Math.round(base),
    montant,
    tauxEffectif,
  };
}
