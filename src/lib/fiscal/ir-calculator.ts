import { IR_BRACKETS_2025, PARTS_FISCALES } from "./constants";
import type { IRResult, SituationFamiliale } from "./types";

/** Plafonnement du quotient familial 2025: 1,759€ par demi-part au-delà de 2 (couple) ou 1 (célibataire) */
const PLAFOND_QF_DEMI_PART = 1_759;

export function getPartsFiscales(situation: SituationFamiliale): number {
  return PARTS_FISCALES[situation] ?? 1;
}

/** Base parts (before children): 1 for single, 2 for married */
function getBaseParts(situation: SituationFamiliale): number {
  return situation.startsWith("marie") ? 2 : 1;
}

/** Calculate raw IR for a given number of parts */
function calculateRawIR(revenuImposable: number, nbParts: number) {
  const revenuParPart = Math.max(0, revenuImposable) / nbParts;
  let impotParPart = 0;
  let tauxMarginal = 0;
  const detailParTranche: IRResult["detailParTranche"] = [];

  for (const bracket of IR_BRACKETS_2025) {
    if (revenuParPart <= bracket.min) break;

    const taxableInBracket =
      Math.min(revenuParPart, bracket.max) - bracket.min;
    const tax = taxableInBracket * bracket.rate;
    impotParPart += tax;

    if (taxableInBracket > 0) {
      tauxMarginal = bracket.rate;
      detailParTranche.push({
        tranche: `${bracket.min.toLocaleString("fr-FR")} € - ${
          bracket.max === Infinity
            ? "+"
            : bracket.max.toLocaleString("fr-FR") + " €"
        }`,
        montant: Math.round(tax * nbParts),
        taux: bracket.rate,
      });
    }
  }

  return {
    impotNet: Math.round(impotParPart * nbParts),
    revenuParPart: Math.round(revenuParPart),
    tauxMarginal,
    detailParTranche,
  };
}

export function calculateIR(
  revenuImposable: number,
  situation: SituationFamiliale
): IRResult {
  const nbParts = getPartsFiscales(situation);
  const baseParts = getBaseParts(situation);
  const extraDemiParts = (nbParts - baseParts) * 2; // number of extra half-parts

  // Calculate with full quotient familial
  const withQF = calculateRawIR(revenuImposable, nbParts);

  // Apply plafonnement: compare with base parts calculation
  let impotNet = withQF.impotNet;
  let reductionQuotient = 0;

  if (extraDemiParts > 0) {
    const withBaseParts = calculateRawIR(revenuImposable, baseParts);
    const maxReduction = Math.round(PLAFOND_QF_DEMI_PART * extraDemiParts);
    const actualReduction = withBaseParts.impotNet - withQF.impotNet;

    if (actualReduction > maxReduction) {
      // Cap the benefit
      impotNet = withBaseParts.impotNet - maxReduction;
      reductionQuotient = maxReduction;
    } else {
      reductionQuotient = Math.max(0, actualReduction);
    }
  }

  // Also compute reduction vs 1 part for display (single person reference)
  if (nbParts > 1) {
    const with1Part = calculateRawIR(revenuImposable, 1);
    const rawSaving = with1Part.impotNet - impotNet;
    if (rawSaving > reductionQuotient) {
      reductionQuotient = Math.max(0, rawSaving);
    }
  }

  const tauxMoyen =
    revenuImposable > 0 ? impotNet / revenuImposable : 0;

  return {
    revenuImposable: Math.round(revenuImposable),
    nbParts,
    revenuParPart: withQF.revenuParPart,
    impotNet,
    tauxMoyen,
    tauxMarginal: withQF.tauxMarginal,
    detailParTranche: withQF.detailParTranche,
    reductionQuotient,
  };
}
