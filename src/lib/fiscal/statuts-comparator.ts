import { calculateTNS } from "./tns-calculator";
import { calculateSASU } from "./sasu-calculator";
import { calculateIR } from "./ir-calculator";
import { calculateIS } from "./is-calculator";
import { calculateDividends } from "./dividends-calculator";
import type {
  StatutsInput,
  StatutsResult,
  StatutResult,
  ProtectionSociale,
} from "./types";

/**
 * EI (Entreprise Individuelle):
 * - Tout le bénéfice est imposé à l'IR
 * - Charges sociales TNS sur le bénéfice
 * - Pas d'IS, pas de dividendes
 * - Responsabilité illimitée
 */
function calculateEI(input: StatutsInput): StatutResult {
  const benefice =
    input.chiffreAffairesHT - input.chargesExploitation;

  // TNS charges on the actual profit (EI = no salary concept, charges on profit)
  const tnsCalc = calculateTNS(benefice);
  const netAvantIR = tnsCalc.netAvantIR;
  const irResult = calculateIR(netAvantIR, input.situationFamiliale);
  const netDisponible = netAvantIR - irResult.impotNet;

  const protection: ProtectionSociale = {
    retraite: "Faible",
    prevoyance: "Faible",
    indemniteJournaliere: true,
    assuranceChomage: false,
  };

  return {
    statut: "EI",
    label: "Entreprise Individuelle",
    chargesSociales: tnsCalc.chargesSociales.total,
    tauxCharges:
      benefice > 0 ? tnsCalc.chargesSociales.total / benefice : 0,
    imposition: {
      type: "IR",
      montantIS: 0,
      montantIR: irResult.impotNet,
      dividendesBruts: 0,
      flatTax: 0,
      dividendesNets: 0,
    },
    netDisponible: Math.round(netDisponible),
    coutTotalEntreprise: Math.round(benefice),
    protectionSociale: protection,
  };
}

/**
 * EURL (à l'IS):
 * - Gérant majoritaire = TNS
 * - IS sur le bénéfice résiduel
 * - Dividendes possibles (flat tax 30%)
 * - Responsabilité limitée aux apports
 */
function calculateEURL(input: StatutsInput): StatutResult {
  const tnsCalc = calculateTNS(input.remunerationBrute);
  const coutRemuneration = tnsCalc.coutTotalEntreprise;
  const beneficeResiduel =
    input.chiffreAffairesHT - input.chargesExploitation - coutRemuneration;

  const isResult = calculateIS(beneficeResiduel);
  const dividendesResult = calculateDividends(
    beneficeResiduel - isResult.montant
  );
  const irResult = calculateIR(tnsCalc.netAvantIR, input.situationFamiliale);

  const netDisponible =
    tnsCalc.netAvantIR - irResult.impotNet + dividendesResult.montantNet;

  const protection: ProtectionSociale = {
    retraite: "Moyenne",
    prevoyance: "Moyenne",
    indemniteJournaliere: true,
    assuranceChomage: false,
  };

  return {
    statut: "EURL",
    label: "EURL (IS)",
    chargesSociales: tnsCalc.chargesSociales.total,
    tauxCharges:
      input.remunerationBrute > 0
        ? tnsCalc.chargesSociales.total / input.remunerationBrute
        : 0,
    imposition: {
      type: "IS",
      montantIS: isResult.montant,
      montantIR: irResult.impotNet,
      dividendesBruts: dividendesResult.montantBrut,
      flatTax: dividendesResult.flatTax,
      dividendesNets: dividendesResult.montantNet,
    },
    netDisponible: Math.round(netDisponible),
    coutTotalEntreprise: Math.round(coutRemuneration),
    protectionSociale: protection,
  };
}

/**
 * SASU:
 * - Président = assimilé salarié
 * - IS sur le bénéfice résiduel
 * - Dividendes possibles (flat tax 30%)
 * - Meilleure protection sociale
 */
function calculateSASUStatut(input: StatutsInput): StatutResult {
  const sasuCalc = calculateSASU(input.remunerationBrute);
  const coutRemuneration = sasuCalc.coutTotalEntreprise;
  const beneficeResiduel =
    input.chiffreAffairesHT - input.chargesExploitation - coutRemuneration;

  const isResult = calculateIS(beneficeResiduel);
  const dividendesResult = calculateDividends(
    beneficeResiduel - isResult.montant
  );
  const irResult = calculateIR(sasuCalc.netAvantIR, input.situationFamiliale);

  const netDisponible =
    sasuCalc.netAvantIR - irResult.impotNet + dividendesResult.montantNet;

  const protection: ProtectionSociale = {
    retraite: "Bonne",
    prevoyance: "Bonne",
    indemniteJournaliere: true,
    assuranceChomage: true,
  };

  return {
    statut: "SASU",
    label: "SASU",
    chargesSociales: sasuCalc.chargesSalariales + sasuCalc.chargesPatronales,
    tauxCharges:
      input.remunerationBrute > 0
        ? (sasuCalc.chargesSalariales + sasuCalc.chargesPatronales) /
          input.remunerationBrute
        : 0,
    imposition: {
      type: "IS",
      montantIS: isResult.montant,
      montantIR: irResult.impotNet,
      dividendesBruts: dividendesResult.montantBrut,
      flatTax: dividendesResult.flatTax,
      dividendesNets: dividendesResult.montantNet,
    },
    netDisponible: Math.round(netDisponible),
    coutTotalEntreprise: Math.round(coutRemuneration),
    protectionSociale: protection,
  };
}

/**
 * SAS (multi-associés):
 * - Même traitement fiscal que SASU pour le dirigeant
 * - Président = assimilé salarié
 * - Structure adaptée à plusieurs associés
 */
function calculateSAS(input: StatutsInput): StatutResult {
  const result = calculateSASUStatut(input);
  return {
    ...result,
    statut: "SAS",
    label: "SAS",
  };
}

function generateRecommandation(statuts: StatutResult[]): {
  statut: StatutResult["statut"];
  raisons: string[];
} {
  const sorted = [...statuts].sort(
    (a, b) => b.netDisponible - a.netDisponible
  );
  const best = sorted[0];
  const raisons: string[] = [];

  if (best.statut === "EI") {
    raisons.push(
      "Le régime EI offre le meilleur revenu net pour votre situation."
    );
    raisons.push(
      "Simplicité de gestion et pas de formalisme sociétaire."
    );
    raisons.push(
      "Attention : responsabilité illimitée sur le patrimoine personnel."
    );
  } else if (best.statut === "EURL") {
    raisons.push(
      "L'EURL (IS) offre le meilleur revenu net grâce à l'optimisation rémunération + dividendes."
    );
    raisons.push(
      "Charges sociales TNS plus faibles qu'en assimilé salarié."
    );
    raisons.push(
      "Responsabilité limitée aux apports."
    );
  } else if (best.statut === "SASU" || best.statut === "SAS") {
    raisons.push(
      `La ${best.statut} offre le meilleur revenu net pour votre situation.`
    );
    raisons.push(
      "Meilleure protection sociale (retraite, prévoyance, chômage)."
    );
    raisons.push(
      "Flexibilité dans la répartition rémunération / dividendes."
    );
  }

  const second = sorted[1];
  const diff = best.netDisponible - second.netDisponible;
  if (diff > 0) {
    raisons.push(
      `Économie de ${diff.toLocaleString("fr-FR")} € par rapport au ${second.label}.`
    );
  }

  return { statut: best.statut, raisons };
}

export function runStatutsComparison(input: StatutsInput): StatutsResult {
  const statuts: StatutResult[] = [
    calculateEI(input),
    calculateEURL(input),
    calculateSASUStatut(input),
    calculateSAS(input),
  ];

  const recommandation = generateRecommandation(statuts);

  return { statuts, recommandation };
}
