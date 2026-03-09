import { TNS_RATES, PASS_2025 } from "./constants";
import type { TNSResult, ChargesDetailTNS } from "./types";

function computeTNSCharges(revenuNet: number): ChargesDetailTNS {
  const PASS = PASS_2025;
  const base = Math.max(revenuNet, TNS_RATES.assietteMini);

  // Maladie-maternité
  let maladieMaterinte: number;
  if (base <= PASS * TNS_RATES.maladieMaterniteSeuil) {
    maladieMaterinte = base * TNS_RATES.maladieMaterniteTaux1;
  } else {
    maladieMaterinte = base * TNS_RATES.maladieMaterniteTaux2;
  }

  // Indemnités journalières
  const ijBase = Math.min(base, PASS * TNS_RATES.ijPlafond);
  const indemniteJournalieres = ijBase * TNS_RATES.indemniteJournalieres;

  // Retraite de base
  const retraiteBasePartie1 = Math.min(base, PASS) * TNS_RATES.retraiteBaseTaux1;
  const retraiteBasePartie2 =
    base > PASS ? (base - PASS) * TNS_RATES.retraiteBaseTaux2 : 0;
  const retraiteBase = retraiteBasePartie1 + retraiteBasePartie2;

  // Retraite complémentaire
  const retraiteCompPartie1 =
    Math.min(base, PASS) * TNS_RATES.retraiteCompTaux1;
  const retraiteCompPartie2 =
    base > PASS
      ? Math.min(base - PASS, PASS * 3) * TNS_RATES.retraiteCompTaux2
      : 0;
  const retraiteComplementaire = retraiteCompPartie1 + retraiteCompPartie2;

  // Invalidité-décès
  const invaliditeDecesBase = Math.min(
    base,
    PASS * TNS_RATES.invaliditeDecesPlafond
  );
  const invaliditeDeces = invaliditeDecesBase * TNS_RATES.invaliditeDecesTaux;

  // Allocations familiales (taux progressif)
  let allocationsFamiliales: number;
  const seuilReduit = PASS * TNS_RATES.allocFamSeuilReduit;
  const seuilPlein = PASS * TNS_RATES.allocFamSeuilPlein;
  if (base <= seuilReduit) {
    allocationsFamiliales = base * TNS_RATES.allocFamTaux;
  } else if (base >= seuilPlein) {
    allocationsFamiliales = base * TNS_RATES.allocFamTauxPlein;
  } else {
    // Taux progressif entre les deux seuils
    const ratio = (base - seuilReduit) / (seuilPlein - seuilReduit);
    const taux =
      TNS_RATES.allocFamTaux +
      ratio * (TNS_RATES.allocFamTauxPlein - TNS_RATES.allocFamTaux);
    allocationsFamiliales = base * taux;
  }

  // CSG/CRDS (assiette = revenu + charges sociales hors CSG/CRDS)
  const chargesHorsCsg =
    maladieMaterinte +
    indemniteJournalieres +
    retraiteBase +
    retraiteComplementaire +
    invaliditeDeces +
    allocationsFamiliales;
  const assietteCsg = base + chargesHorsCsg;
  const csgCrds = assietteCsg * TNS_RATES.csgCrdsTotal;

  // Formation professionnelle
  const formationPro = TNS_RATES.formationPro;

  const total =
    maladieMaterinte +
    indemniteJournalieres +
    retraiteBase +
    retraiteComplementaire +
    invaliditeDeces +
    allocationsFamiliales +
    csgCrds +
    formationPro;

  return {
    maladieMaterinte: Math.round(maladieMaterinte),
    indemniteJournalieres: Math.round(indemniteJournalieres),
    retraiteBase: Math.round(retraiteBase),
    retraiteComplementaire: Math.round(retraiteComplementaire),
    invaliditeDeces: Math.round(invaliditeDeces),
    allocationsFamiliales: Math.round(allocationsFamiliales),
    csgCrds: Math.round(csgCrds),
    formationPro: Math.round(formationPro),
    total: Math.round(total),
  };
}

/**
 * Calcule les charges TNS avec convergence itérative.
 * Les charges TNS sont calculées sur le revenu net, mais le revenu net
 * dépend des charges (dépendance circulaire).
 */
export function calculateTNS(remunerationBrute: number): TNSResult {
  // Estimation initiale du net (~55% du brut)
  let netEstimate = remunerationBrute * 0.55;

  for (let i = 0; i < 20; i++) {
    const charges = computeTNSCharges(netEstimate);
    const newNet = remunerationBrute - charges.total;
    if (Math.abs(newNet - netEstimate) < 1) {
      netEstimate = newNet;
      break;
    }
    netEstimate = newNet;
  }

  const chargesSociales = computeTNSCharges(netEstimate);
  const netAvantIR = remunerationBrute - chargesSociales.total;

  // CSG déductible (6.8% de l'assiette)
  // Le net imposable est net + CSG non déductible
  // Simplifié: on utilise netAvantIR directement comme base IR

  return {
    remunerationBrute: Math.round(remunerationBrute),
    chargesSociales,
    netAvantIR: Math.round(netAvantIR),
    coutTotalEntreprise: Math.round(remunerationBrute), // TNS: le brut = coût entreprise
  };
}
