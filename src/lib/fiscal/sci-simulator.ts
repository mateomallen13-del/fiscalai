import { calculateIR } from "./ir-calculator";
import { calculateIS } from "./is-calculator";
import type { SciInput, SciAnnee, SciResult } from "./types";

/** Prélèvements sociaux on revenus fonciers (2025) */
const PRELEVEMENTS_SOCIAUX_RATE = 0.172;

/**
 * SCI Simulator: Compare SCI à l'IR vs SCI à l'IS over 3 years.
 *
 * SCI IR: rental income taxed as revenus fonciers (IR + 17.2% social levies).
 *   Deductible: charges, loan interest, works. NOT depreciation.
 *
 * SCI IS: rental income taxed at corporate level (IS).
 *   Deductible: charges, loan interest, works, AND depreciation.
 *   Dividends distributed to individual taxed at 30% flat tax.
 */
export function runSciSimulation(input: SciInput): SciResult {
  const annees: SciAnnee[] = [];
  let cumulIR = 0;
  let cumulIS = 0;
  const partRatio = input.partsSCI / 100;

  for (let i = 0; i < 3; i++) {
    const croissance = Math.pow(1 + input.tauxCroissance / 100, i);
    const loyers = Math.round(input.loyersAnnuels * croissance);

    // Common deductions (both regimes)
    const chargesDeductibles =
      input.chargesExploitation + input.interetsEmprunt + input.travauxDeductibles;

    // --- SCI IR ---
    // Revenu foncier = loyers - charges - intérêts - travaux (no depreciation)
    const revenuFoncier = Math.max(0, Math.round((loyers - chargesDeductibles) * partRatio));
    const irCalc = calculateIR(revenuFoncier, input.situationFamiliale);
    const prelevementsSociaux = Math.round(revenuFoncier * PRELEVEMENTS_SOCIAUX_RATE);
    const revenuNetIR = revenuFoncier - irCalc.impotNet - prelevementsSociaux;

    // --- SCI IS ---
    // Résultat comptable = loyers - charges - intérêts - travaux - amortissement
    const resultatComptable = Math.max(
      0,
      Math.round(loyers - chargesDeductibles - input.amortissementAnnuel)
    );
    const isCalc = calculateIS(resultatComptable);
    const resultatApresIS = resultatComptable - isCalc.montant;
    // Distribute 100% as dividends for comparison
    const dividendesBruts = Math.round(resultatApresIS * partRatio);
    const flatTax = Math.round(dividendesBruts * 0.3);
    const dividendesNets = dividendesBruts - flatTax;
    const tresorerie = Math.round(resultatApresIS);

    const avantageSciIS = dividendesNets - revenuNetIR;

    cumulIR += revenuNetIR;
    cumulIS += dividendesNets;

    annees.push({
      annee: i + 1,
      loyers,
      ir: {
        revenuFoncier,
        irMontant: irCalc.impotNet,
        prelevementsSociaux,
        revenuNet: revenuNetIR,
      },
      is: {
        resultatComptable,
        montantIS: isCalc.montant,
        resultatApresIS,
        dividendesBruts,
        flatTax,
        dividendesNets,
        tresorerie,
      },
      avantageSciIS: Math.round(avantageSciIS),
    });
  }

  const economie = Math.abs(cumulIS - cumulIR);
  const regimeRecommande = cumulIS >= cumulIR ? "IS" : "IR";

  return {
    annees,
    cumulIR: Math.round(cumulIR),
    cumulIS: Math.round(cumulIS),
    regimeRecommande,
    economie: Math.round(economie),
  };
}
