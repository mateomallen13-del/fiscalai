import { calculateSASU } from "./sasu-calculator";
import { calculateIR } from "./ir-calculator";
import { calculateIS } from "./is-calculator";
import { calculateDividends } from "./dividends-calculator";
import type {
  OptRemunerationInput,
  OptRemunerationResult,
  OptRemunerationPoint,
  SituationFamiliale,
} from "./types";

/**
 * Compute a single point on the salary/dividends curve.
 * Company has 'benefice' profit. Director takes 'salaireBrut' as salary.
 * Rest goes to IS → dividends → flat tax.
 */
function computePoint(
  benefice: number,
  salaireBrut: number,
  situation: SituationFamiliale
): OptRemunerationPoint {
  const sasuCalc = calculateSASU(salaireBrut);
  const coutRemuneration = sasuCalc.coutTotalEntreprise;
  const beneficeResiduel = Math.max(0, benefice - coutRemuneration);
  const isCalc = calculateIS(beneficeResiduel);
  const profitApresIS = beneficeResiduel - isCalc.montant;
  const dividendesCalc = calculateDividends(profitApresIS);
  const irCalc = calculateIR(sasuCalc.netAvantIR, situation);

  const revenuNetTotal =
    sasuCalc.netAvantIR - irCalc.impotNet + dividendesCalc.montantNet;

  return {
    salaireBrut,
    salaireNet: sasuCalc.netAvantIR,
    chargesSociales:
      sasuCalc.chargesSalariales + sasuCalc.chargesPatronales,
    ir: irCalc.impotNet,
    dividendesBruts: dividendesCalc.montantBrut,
    flatTax: dividendesCalc.flatTax,
    dividendesNets: dividendesCalc.montantNet,
    is: isCalc.montant,
    revenuNetTotal: Math.round(revenuNetTotal),
    coutEntreprise: Math.round(coutRemuneration + isCalc.montant + dividendesCalc.flatTax),
  };
}

/**
 * Find the optimal salary/dividends split to maximize net take-home pay.
 * Tests 41 points from 0% to 100% of company profit as salary.
 */
export function runOptRemunerationSimulation(
  input: OptRemunerationInput
): OptRemunerationResult {
  const { beneficeSociete, situationFamiliale } = input;
  const courbe: OptRemunerationPoint[] = [];
  let optimal: OptRemunerationPoint | null = null;

  const steps = 40;
  for (let s = 0; s <= steps; s++) {
    const salaireBrut = Math.round((beneficeSociete * s) / steps);
    const point = computePoint(beneficeSociete, salaireBrut, situationFamiliale);
    courbe.push(point);
    if (!optimal || point.revenuNetTotal > optimal.revenuNetTotal) {
      optimal = point;
    }
  }

  // Edge cases: all salary, all dividends
  const toutSalaire = computePoint(beneficeSociete, beneficeSociete, situationFamiliale);
  const toutDividendes = computePoint(beneficeSociete, 0, situationFamiliale);

  return {
    optimal: optimal!,
    toutSalaire,
    toutDividendes,
    courbe,
    economieVsToutSalaire: Math.round(
      Math.max(0, optimal!.revenuNetTotal - toutSalaire.revenuNetTotal)
    ),
    economieVsToutDividendes: Math.round(
      Math.max(0, optimal!.revenuNetTotal - toutDividendes.revenuNetTotal)
    ),
  };
}
