import { calculateTNS } from "./tns-calculator";
import { calculateSASU } from "./sasu-calculator";
import { calculateIR } from "./ir-calculator";
import { calculateIS } from "./is-calculator";
import { calculateDividends } from "./dividends-calculator";
import type { IsIrInput, IsIrAnnee, IsIrResult } from "./types";

/**
 * Simulation IS vs IR sur 3 ans.
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

  for (let i = 0; i < 3; i++) {
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

  return {
    annees,
    cumulIS: Math.round(cumulIS),
    cumulIR: Math.round(cumulIR),
    regimeRecommande,
    economie: Math.round(economie),
  };
}
