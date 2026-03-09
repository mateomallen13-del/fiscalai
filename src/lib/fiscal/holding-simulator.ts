import { calculateIS } from "./is-calculator";
import { calculateIR } from "./ir-calculator";
import { calculateSASU } from "./sasu-calculator";
import { calculateDividends } from "./dividends-calculator";
import type { HoldingInput, HoldingResult } from "./types";

/**
 * Holding Company Simulator
 *
 * Compares:
 * - Without holding: single company (IS + salary + dividends to individual)
 * - With holding: subsidiary (IS) → dividends to holding (95% exempt) → holding (IS)
 *   → salary from holding + dividends from holding to individual
 *
 * Parent-subsidiary regime (régime mère-fille):
 * - 95% of dividends received are exempt from IS
 * - Only 5% "quote-part de frais et charges" is taxable
 */
export function runHoldingSimulation(input: HoldingInput): HoldingResult {
  const {
    beneficeFiliale,
    remunerationGerant,
    dividendesVersesHolding,
    chargesHolding,
    situationFamiliale,
    remunerationDepuisHolding,
  } = input;

  const dividendesPct = dividendesVersesHolding / 100;

  // ═══════════════════════════════════════════════════════════
  // SCENARIO 1: Without holding (direct structure)
  // ═══════════════════════════════════════════════════════════

  // Director salary (SASU)
  const sasuDirect = calculateSASU(remunerationGerant);
  const beneficeApresRem = Math.max(0, beneficeFiliale - sasuDirect.coutTotalEntreprise);

  // IS on residual profit
  const isDirect = calculateIS(beneficeApresRem);
  const profitApresIS = beneficeApresRem - isDirect.montant;

  // Dividends to individual
  const divDirect = calculateDividends(profitApresIS);

  // IR on salary
  const irDirect = calculateIR(sasuDirect.netAvantIR, situationFamiliale);

  const revenuSansHolding =
    sasuDirect.netAvantIR - irDirect.impotNet + divDirect.montantNet;

  // ═══════════════════════════════════════════════════════════
  // SCENARIO 2: With holding
  // ═══════════════════════════════════════════════════════════

  // --- Subsidiary level ---
  const sasuFiliale = calculateSASU(remunerationGerant);
  const beneficeFilialeApresRem = Math.max(
    0,
    beneficeFiliale - sasuFiliale.coutTotalEntreprise
  );
  const isFiliale = calculateIS(beneficeFilialeApresRem);
  const profitFilialeApresIS = beneficeFilialeApresRem - isFiliale.montant;
  const dividendesVersesAuHolding = Math.round(profitFilialeApresIS * dividendesPct);

  // --- Holding level ---
  // Parent-subsidiary regime: 95% exempt, 5% taxable as quote-part
  const quotePartFrais = Math.round(dividendesVersesAuHolding * 0.05);

  // Additional salary from holding
  const sasuHolding = remunerationDepuisHolding > 0
    ? calculateSASU(remunerationDepuisHolding)
    : { coutTotalEntreprise: 0, netAvantIR: 0, chargesSalariales: 0, chargesPatronales: 0, remunerationBrute: 0 };

  // Holding taxable income = quote-part + any other income - charges - salary cost
  const holdingResultat = Math.max(
    0,
    quotePartFrais - chargesHolding - sasuHolding.coutTotalEntreprise
  );
  const isHolding = calculateIS(holdingResultat);

  // Holding cash available for dividends
  const holdingTresorerie =
    dividendesVersesAuHolding -
    isHolding.montant -
    chargesHolding -
    sasuHolding.coutTotalEntreprise;

  const dividendesHoldingBruts = Math.max(0, Math.round(holdingTresorerie));
  const flatTaxHolding = Math.round(dividendesHoldingBruts * 0.3);
  const dividendesHoldingNets = dividendesHoldingBruts - flatTaxHolding;

  // IR on salaries (from both subsidiary and holding)
  const totalRemunerationNette =
    sasuFiliale.netAvantIR + sasuHolding.netAvantIR;
  const irHolding = calculateIR(totalRemunerationNette, situationFamiliale);

  const revenuAvecHolding =
    totalRemunerationNette - irHolding.impotNet + dividendesHoldingNets;

  // ═══════════════════════════════════════════════════════════
  // Comparison
  // ═══════════════════════════════════════════════════════════

  const economie = Math.round(Math.abs(revenuAvecHolding - revenuSansHolding));
  const recommandation =
    revenuAvecHolding > revenuSansHolding ? "avec_holding" : "sans_holding";

  const raisons: string[] = [];
  if (recommandation === "avec_holding") {
    raisons.push(
      "Le regime mere-fille exonere 95% des dividendes remontes a la holding."
    );
    if (remunerationDepuisHolding > 0) {
      raisons.push(
        "La remuneration depuis la holding permet d'optimiser les tranches d'IR."
      );
    }
    raisons.push(
      `Economie nette de ${Math.round(economie).toLocaleString("fr-FR")} € par rapport a la structure directe.`
    );
  } else {
    raisons.push(
      "Les frais de fonctionnement de la holding reduisent l'avantage fiscal."
    );
    if (chargesHolding > quotePartFrais) {
      raisons.push(
        "Les charges de la holding depassent l'avantage du regime mere-fille."
      );
    }
    raisons.push(
      "Une structure directe est plus simple et plus avantageuse dans ce scenario."
    );
  }

  return {
    sansHolding: {
      benefice: beneficeFiliale,
      is: isDirect.montant,
      dividendesBruts: divDirect.montantBrut,
      flatTax: divDirect.flatTax,
      dividendesNets: divDirect.montantNet,
      remunerationNette: sasuDirect.netAvantIR,
      irRemuneration: irDirect.impotNet,
      revenuTotal: Math.round(revenuSansHolding),
    },
    avecHolding: {
      beneficeFiliale,
      isFiliale: isFiliale.montant,
      dividendesVersesHolding: dividendesVersesAuHolding,
      quotePartFrais,
      isHolding: isHolding.montant,
      chargesHolding,
      tresorerieHolding: Math.round(holdingTresorerie),
      remunerationHoldingNette: sasuHolding.netAvantIR,
      irHolding: irHolding.impotNet,
      dividendesHoldingBruts,
      flatTaxHolding,
      dividendesHoldingNets,
      revenuTotal: Math.round(revenuAvecHolding),
    },
    economie,
    recommandation,
    raisons,
  };
}
