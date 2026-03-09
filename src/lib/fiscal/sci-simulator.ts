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
 *   IS is computed on the fiscal result (with depreciation).
 *   But depreciation is non-cash — actual cash flow = loyers - charges - interets - travaux.
 *   Distributable dividends = fiscal result after IS (capped by accounting rules).
 *   Remaining cash (from depreciation shield) stays in the SCI as reserves.
 */
export function runSciSimulation(input: SciInput): SciResult {
  const annees: SciAnnee[] = [];
  let cumulIR = 0;
  let cumulIS = 0;
  const partRatio = input.partsSCI / 100;

  for (let i = 0; i < 3; i++) {
    const croissance = Math.pow(1 + input.tauxCroissance / 100, i);
    const loyers = Math.round(input.loyersAnnuels * croissance);

    // Cash deductions (both regimes)
    const chargesCash =
      input.chargesExploitation + input.interetsEmprunt + input.travauxDeductibles;

    // --- SCI IR ---
    // Revenu foncier = loyers - charges - intérêts - travaux (no depreciation)
    const revenuFoncier = Math.max(0, Math.round((loyers - chargesCash) * partRatio));
    const irCalc = calculateIR(revenuFoncier, input.situationFamiliale);
    const prelevementsSociaux = Math.round(revenuFoncier * PRELEVEMENTS_SOCIAUX_RATE);
    const revenuNetIR = revenuFoncier - irCalc.impotNet - prelevementsSociaux;

    // --- SCI IS ---
    // Fiscal result (with depreciation — non-cash deduction reduces tax base)
    const resultatFiscal = Math.max(0, loyers - chargesCash - input.amortissementAnnuel);

    // Actual cash generated (depreciation is non-cash, so cash > fiscal result)
    const cashFlow = Math.max(0, loyers - chargesCash);

    // IS computed on fiscal result
    const isCalc = calculateIS(resultatFiscal);

    // Distributable dividends: limited to fiscal result after IS
    // (can't distribute more than accounting profit per French law)
    const distributableProfit = Math.max(0, resultatFiscal - isCalc.montant);

    // Associate's share
    const dividendesBruts = Math.round(distributableProfit * partRatio);
    const flatTax = Math.round(dividendesBruts * 0.3);
    const dividendesNets = dividendesBruts - flatTax;

    // Cash remaining in SCI (includes depreciation cash shield)
    // = total cash - IS paid - dividends distributed
    const tresorerieRestante = Math.round(cashFlow - isCalc.montant - distributableProfit);

    // For comparison: associate's total benefit under IS =
    // dividends received + their share of cash accumulation in SCI
    // We compare dividendesNets (what they actually receive as cash)
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
        resultatFiscal,
        cashFlow,
        montantIS: isCalc.montant,
        dividendesBruts,
        flatTax,
        dividendesNets,
        tresorerieRestante: Math.max(0, tresorerieRestante),
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
