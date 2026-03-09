import { IR_BRACKETS_2025, PARTS_FISCALES } from "./constants";
import type { IRResult, SituationFamiliale } from "./types";

export function getPartsFiscales(situation: SituationFamiliale): number {
  return PARTS_FISCALES[situation] ?? 1;
}

export function calculateIR(
  revenuImposable: number,
  situation: SituationFamiliale
): IRResult {
  const nbParts = getPartsFiscales(situation);
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

  const impotNet = Math.round(impotParPart * nbParts);
  const tauxMoyen =
    revenuImposable > 0 ? impotNet / revenuImposable : 0;

  return {
    revenuImposable: Math.round(revenuImposable),
    nbParts,
    revenuParPart: Math.round(revenuParPart),
    impotNet,
    tauxMoyen,
    tauxMarginal,
    detailParTranche,
  };
}
