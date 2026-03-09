import { calculateTNS } from "./tns-calculator";
import { calculateSASU } from "./sasu-calculator";
import { calculateIR } from "./ir-calculator";
import { calculateIS } from "./is-calculator";
import { calculateDividends } from "./dividends-calculator";
import type { IsIrInput, IsIrAnnee, IsIrResult, OptimalSplitPoint } from "./types";

/**
 * Simulation IS vs IR sur 5 ans.
 *
 * Régime IS : société à l'IS, dirigeant assimilé salarié (SASU),
 *   rémunération + dividendes avec flat tax 30%.
 *
 * Régime IR : entreprise à l'IR (EI / EURL IR),
 *   tout le bénéfice est imposé à l'IR, charges TNS.
 */
export function runIsIrSimulation(input: IsIrInput): IsIrResult {
  const annees: IsIrAnnee[] = [];
  let cumulIS = 0;
  let cumulIR = 0;

  for (let i = 0; i < 5; i++) {
    const croissance = Math.pow(1 + input.tauxCroissance / 100, i);
    const benefice = Math.round(input.beneficeAnnuel * croissance);
    const remuneration = input.remunerationBrute;

    // --- Régime IS (SASU) ---
    const sasuCalc = calculateSASU(remuneration);
    const coutRemuneration = sasuCalc.coutTotalEntreprise;
    const beneficeResiduelIS = Math.max(0, benefice - coutRemuneration);
    const isCalc = calculateIS(beneficeResiduelIS);
    const profitApresIS = beneficeResiduelIS - isCalc.montant;
    const dividendesBruts = Math.round(
      profitApresIS * (input.partDividendes / 100)
    );
    const dividendesCalc = calculateDividends(dividendesBruts);
    const reserves = profitApresIS - dividendesBruts;
    const irSurRemuneration = calculateIR(
      sasuCalc.netAvantIR,
      input.situationFamiliale
    );
    const revenuTotalIS =
      sasuCalc.netAvantIR -
      irSurRemuneration.impotNet +
      dividendesCalc.montantNet;

    // --- Régime IR (EI/TNS) ---
    const tnsCalc = calculateTNS(benefice);
    const netAvantIR = tnsCalc.netAvantIR;
    const irCalc = calculateIR(netAvantIR, input.situationFamiliale);
    const revenuApresIR = netAvantIR - irCalc.impotNet;

    const avantageIS = Math.round(revenuTotalIS - revenuApresIR);
    cumulIS += Math.round(revenuTotalIS);
    cumulIR += Math.round(revenuApresIR);

    annees.push({
      annee: i + 1,
      benefice,
      is: {
        remunerationNette: sasuCalc.netAvantIR,
        chargesSociales:
          sasuCalc.chargesSalariales + sasuCalc.chargesPatronales,
        coutRemuneration,
        beneficeResiduel: Math.round(beneficeResiduelIS),
        montantIS: isCalc.montant,
        dividendesBruts: dividendesCalc.montantBrut,
        flatTax: dividendesCalc.flatTax,
        dividendesNets: dividendesCalc.montantNet,
        reserves: Math.round(reserves),
        revenuTotalDirigeant: Math.round(revenuTotalIS),
        irSurRemuneration: irSurRemuneration.impotNet,
      },
      ir: {
        beneficeImposable: Math.round(benefice),
        chargesSociales: tnsCalc.chargesSociales.total,
        revenuNet: Math.round(netAvantIR),
        montantIR: irCalc.impotNet,
        revenuApresIR: Math.round(revenuApresIR),
      },
      avantageIS,
    });
  }

  const economie = Math.abs(cumulIS - cumulIR);
  const regimeRecommande = cumulIS >= cumulIR ? "IS" : "IR";

  // --- Optimal salary vs dividends split ---
  const { optimalSplit, splitCurve } = computeOptimalSplit(
    input.beneficeAnnuel,
    input.situationFamiliale
  );

  return {
    annees,
    cumulIS: Math.round(cumulIS),
    cumulIR: Math.round(cumulIR),
    regimeRecommande,
    economie: Math.round(economie),
    optimalSplit,
    splitCurve,
  };
}

/**
 * Compute the optimal salary vs dividends split for year 1 benefit.
 * Tests salary from 0 to benefit in steps, rest goes to IS + dividends.
 */
function computeOptimalSplit(
  benefice: number,
  situation: string
): { optimalSplit: OptimalSplitPoint; splitCurve: OptimalSplitPoint[] } {
  const curve: OptimalSplitPoint[] = [];
  let best: OptimalSplitPoint | null = null;

  // Test 21 salary levels (0%, 5%, 10%, ... 100% of benefit)
  const steps = 20;
  for (let s = 0; s <= steps; s++) {
    const salaireBrut = Math.round((benefice * s) / steps);
    const point = computeSplitPoint(benefice, salaireBrut, situation);
    curve.push(point);
    if (!best || point.revenuNet > best.revenuNet) {
      best = point;
    }
  }

  return {
    optimalSplit: best!,
    splitCurve: curve,
  };
}

function computeSplitPoint(
  benefice: number,
  salaireBrut: number,
  situation: string
): OptimalSplitPoint {
  const sasuCalc = calculateSASU(salaireBrut);
  const coutRemuneration = sasuCalc.coutTotalEntreprise;
  const beneficeResiduel = Math.max(0, benefice - coutRemuneration);
  const isCalc = calculateIS(beneficeResiduel);
  const profitApresIS = beneficeResiduel - isCalc.montant;
  const dividendesCalc = calculateDividends(profitApresIS);
  const irCalc = calculateIR(
    sasuCalc.netAvantIR,
    situation as import("./types").SituationFamiliale
  );

  const revenuNet =
    sasuCalc.netAvantIR - irCalc.impotNet + dividendesCalc.montantNet;

  return {
    salaireBrut,
    dividendes: dividendesCalc.montantBrut,
    chargesSociales: sasuCalc.chargesSalariales + sasuCalc.chargesPatronales,
    ir: irCalc.impotNet,
    flatTax: dividendesCalc.flatTax,
    is: isCalc.montant,
    revenuNet: Math.round(revenuNet),
  };
}
