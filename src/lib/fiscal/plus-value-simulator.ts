import { calculateIR } from "./ir-calculator";
import type { PlusValueInput, PlusValueResult, PlusValueScenario } from "./types";

const PRELEVEMENTS_SOCIAUX = 0.172;
const FLAT_TAX_RATE = 0.30;
const ABATTEMENT_RETRAITE = 500_000;

/**
 * Abattement pour durée de détention (PME, art. 150-0 D ter CGI)
 * - 50% après 2 ans et avant 8 ans
 * - 65% après 8 ans
 * Applicable uniquement au barème progressif, pas au flat tax.
 */
function getAbattementDuree(duree: number, isPME: boolean): number {
  if (!isPME) {
    // Titres acquis avant 2018: abattement de droit commun
    if (duree >= 8) return 0.65;
    if (duree >= 2) return 0.50;
    return 0;
  }
  // PME renforcé (art. 150-0 D ter)
  if (duree >= 8) return 0.65;
  if (duree >= 4) return 0.50;
  if (duree >= 1) return 0.50;
  return 0;
}

/**
 * Exonération PME (art. 150-0 D ter + 150-0 D bis)
 * Conditions: PME < 250 salariés, CA < 50M€, détention > 8 ans
 * Pour simplification: on vérifie isPME + durée >= 8
 */
function checkExonerationPME(duree: number, isPME: boolean): boolean {
  return isPME && duree >= 8;
}

export function runPlusValueSimulation(input: PlusValueInput): PlusValueResult {
  const plusValueBrute = Math.max(0, input.prixCession - input.prixAcquisition);

  // Check full PME exemption (art 150-0 D ter - départ retraite)
  const exonerationPME =
    input.departRetraite && checkExonerationPME(input.dureeDetention, input.isPME);
  const exonerationMontant = exonerationPME ? plusValueBrute : 0;

  if (exonerationPME) {
    // Full exemption — only prélèvements sociaux apply on the non-exempt part
    const ps = Math.round(plusValueBrute * PRELEVEMENTS_SOCIAUX);
    const scenario: PlusValueScenario = {
      label: "Exonération PME (départ retraite)",
      plusValueBrute,
      abattement: plusValueBrute,
      tauxAbattement: 1,
      plusValueImposable: 0,
      impot: 0,
      prelevementsSociaux: ps,
      abattementRetraite: 0,
      netApresImpot: input.prixCession - ps,
    };

    return {
      plusValueBrute,
      flatTax: scenario,
      bareme: scenario,
      recommandation: "flat_tax",
      economie: 0,
      exonerationPME: true,
      exonerationMontant,
    };
  }

  // --- Scenario 1: Flat tax 30% ---
  const flatTaxImpot = Math.round(plusValueBrute * FLAT_TAX_RATE);
  const flatTaxScenario: PlusValueScenario = {
    label: "Flat tax (PFU 30%)",
    plusValueBrute,
    abattement: 0,
    tauxAbattement: 0,
    plusValueImposable: plusValueBrute,
    impot: flatTaxImpot,
    prelevementsSociaux: 0, // Included in the 30%
    abattementRetraite: 0,
    netApresImpot: input.prixCession - flatTaxImpot,
  };

  // --- Scenario 2: Barème progressif IR ---
  const tauxAbattement = getAbattementDuree(input.dureeDetention, input.isPME);
  const abattement = Math.round(plusValueBrute * tauxAbattement);
  let pvImposable = plusValueBrute - abattement;

  // Abattement départ retraite (500k€) — applicable only with barème
  let abattementRetraite = 0;
  if (input.departRetraite && input.isPME) {
    abattementRetraite = Math.min(pvImposable, ABATTEMENT_RETRAITE);
    pvImposable = Math.max(0, pvImposable - abattementRetraite);
  }

  // IR on the taxable amount (added to other income via barème)
  const irCalc = calculateIR(pvImposable, input.situationFamiliale);
  // Prélèvements sociaux on full PV (no abattement for PS)
  const ps = Math.round(plusValueBrute * PRELEVEMENTS_SOCIAUX);

  const baremeScenario: PlusValueScenario = {
    label: "Barème progressif IR",
    plusValueBrute,
    abattement,
    tauxAbattement,
    plusValueImposable: pvImposable,
    impot: irCalc.impotNet,
    prelevementsSociaux: ps,
    abattementRetraite,
    netApresImpot: input.prixCession - irCalc.impotNet - ps,
  };

  // Compare
  const netFlatTax = flatTaxScenario.netApresImpot;
  const netBareme = baremeScenario.netApresImpot;
  const recommandation = netFlatTax >= netBareme ? "flat_tax" : "bareme";
  const economie = Math.abs(netFlatTax - netBareme);

  return {
    plusValueBrute,
    flatTax: flatTaxScenario,
    bareme: baremeScenario,
    recommandation,
    economie: Math.round(economie),
    exonerationPME: false,
    exonerationMontant: 0,
  };
}
