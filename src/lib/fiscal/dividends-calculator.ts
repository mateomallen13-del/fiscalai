import { FLAT_TAX_RATE } from "./constants";
import type { DividendesResult } from "./types";

export function calculateDividends(
  beneficeApresIS: number
): DividendesResult {
  const montantBrut = Math.max(0, Math.round(beneficeApresIS));
  const flatTax = Math.round(montantBrut * FLAT_TAX_RATE);
  const montantNet = montantBrut - flatTax;

  return {
    montantBrut,
    flatTax,
    montantNet,
  };
}
