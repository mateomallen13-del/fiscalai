import { calculateTNS } from "./tns-calculator";
import { calculateSASU } from "./sasu-calculator";
import { calculateIR } from "./ir-calculator";
import { calculateIS } from "./is-calculator";
import { calculateDividends } from "./dividends-calculator";
import type {
  SimulationInput,
  SimulationResult,
  ScenarioResult,
} from "./types";

export function runSimulation(input: SimulationInput): SimulationResult {
  const { chiffreAffairesHT, chargesExploitation, remunerationBrute, situationFamiliale } =
    input;

  // --- Scénario TNS (Gérant majoritaire EURL) ---
  const tnsCalc = calculateTNS(remunerationBrute);
  const tnsBenefice =
    chiffreAffairesHT - chargesExploitation - tnsCalc.coutTotalEntreprise;
  const tnsIS = calculateIS(tnsBenefice);
  const tnsDividendes = calculateDividends(tnsBenefice - tnsIS.montant);
  const tnsIR = calculateIR(tnsCalc.netAvantIR, situationFamiliale);
  const tnsNetApresIR = tnsCalc.netAvantIR - tnsIR.impotNet;
  const tnsRevenuTotal = tnsNetApresIR + tnsDividendes.montantNet;

  const tns: ScenarioResult = {
    regime: "TNS",
    remunerationBrute: tnsCalc.remunerationBrute,
    chargesSociales: tnsCalc.chargesSociales.total,
    chargesDetail: tnsCalc.chargesSociales,
    netAvantIR: tnsCalc.netAvantIR,
    ir: tnsIR,
    netApresIR: Math.round(tnsNetApresIR),
    coutTotalEntreprise: tnsCalc.coutTotalEntreprise,
    beneficeResiduel: Math.round(tnsBenefice),
    is: tnsIS,
    dividendes: tnsDividendes,
    revenuTotalDirigeant: Math.round(tnsRevenuTotal),
  };

  // --- Scénario SASU (Président assimilé salarié) ---
  const sasuCalc = calculateSASU(remunerationBrute);
  const sasuBenefice =
    chiffreAffairesHT - chargesExploitation - sasuCalc.coutTotalEntreprise;
  const sasuIS = calculateIS(sasuBenefice);
  const sasuDividendes = calculateDividends(sasuBenefice - sasuIS.montant);
  const sasuIR = calculateIR(sasuCalc.netAvantIR, situationFamiliale);
  const sasuNetApresIR = sasuCalc.netAvantIR - sasuIR.impotNet;
  const sasuRevenuTotal = sasuNetApresIR + sasuDividendes.montantNet;

  const sasu: ScenarioResult = {
    regime: "SASU",
    remunerationBrute: sasuCalc.remunerationBrute,
    chargesSociales: sasuCalc.chargesSalariales + sasuCalc.chargesPatronales,
    chargesDetail: {
      salariales: sasuCalc.chargesSalariales,
      patronales: sasuCalc.chargesPatronales,
    },
    netAvantIR: sasuCalc.netAvantIR,
    ir: sasuIR,
    netApresIR: Math.round(sasuNetApresIR),
    coutTotalEntreprise: sasuCalc.coutTotalEntreprise,
    beneficeResiduel: Math.round(sasuBenefice),
    is: sasuIS,
    dividendes: sasuDividendes,
    revenuTotalDirigeant: Math.round(sasuRevenuTotal),
  };

  // Déterminer le régime recommandé
  const economie = tns.revenuTotalDirigeant - sasu.revenuTotalDirigeant;
  const regimeRecommande = economie >= 0 ? "TNS" : "SASU";

  return {
    tns,
    sasu,
    economie: Math.abs(Math.round(economie)),
    regimeRecommande,
  };
}
