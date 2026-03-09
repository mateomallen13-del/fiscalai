import { SASU_RATES } from "./constants";
import type { SASUResult } from "./types";

export function calculateSASU(remunerationBrute: number): SASUResult {
  const chargesSalariales = Math.round(
    remunerationBrute * SASU_RATES.chargesSalarialesGlobal
  );
  const chargesPatronales = Math.round(
    remunerationBrute * SASU_RATES.chargesPatronalesGlobal
  );
  const netAvantIR = Math.round(
    remunerationBrute * SASU_RATES.netBrutRatio
  );
  const coutTotalEntreprise = Math.round(
    remunerationBrute + chargesPatronales
  );

  return {
    remunerationBrute: Math.round(remunerationBrute),
    chargesSalariales,
    chargesPatronales,
    netAvantIR,
    coutTotalEntreprise,
  };
}
