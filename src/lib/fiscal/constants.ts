export const FISCAL_YEAR = 2025;

// Plafond Annuel de la Sécurité Sociale
export const PASS_2025 = 47_100;

// Tranches IR 2025 (par part)
export const IR_BRACKETS_2025 = [
  { min: 0, max: 11_294, rate: 0 },
  { min: 11_294, max: 28_797, rate: 0.11 },
  { min: 28_797, max: 82_341, rate: 0.30 },
  { min: 82_341, max: 177_106, rate: 0.41 },
  { min: 177_106, max: Infinity, rate: 0.45 },
] as const;

// Tranches IS 2025
export const IS_BRACKETS_2025 = [
  { min: 0, max: 42_500, rate: 0.15 },
  { min: 42_500, max: Infinity, rate: 0.25 },
] as const;

// Flat tax dividendes
export const FLAT_TAX_RATE = 0.30;
export const FLAT_TAX_IR = 0.128;
export const FLAT_TAX_PS = 0.172;

// Taux TNS détaillés (Gérant majoritaire EURL - 2025)
export const TNS_RATES = {
  // Maladie-maternité
  maladieMaterniteTaux1: 0.0, // Taux réduit pour revenus < 40% PASS
  maladieMaterniteTaux2: 0.065, // Taux normal au-delà
  maladieMaterniteSeuil: 0.4, // 40% du PASS

  // Indemnités journalières
  indemniteJournalieres: 0.0085,
  ijPlafond: 5, // 5 PASS

  // Retraite de base
  retraiteBaseTaux1: 0.1775, // Jusqu'au PASS
  retraiteBaseTaux2: 0.006, // Au-delà du PASS (déplafonnée)

  // Retraite complémentaire
  retraiteCompTaux1: 0.07, // Jusqu'au PASS
  retraiteCompTaux2: 0.08, // De 1 à 4 PASS

  // Invalidité-décès
  invaliditeDecesTaux: 0.013,
  invaliditeDecesPlafond: 1, // 1 PASS

  // Allocations familiales
  allocFamTaux: 0.0, // Réduit (< 110% PASS)
  allocFamTauxPlein: 0.031, // Plein (> 140% PASS)
  allocFamSeuilReduit: 1.1, // 110% PASS
  allocFamSeuilPlein: 1.4, // 140% PASS

  // CSG/CRDS
  csgDeductible: 0.068, // 6,8% déductible
  csgNonDeductible: 0.024, // 2,4% non déductible
  crds: 0.005, // 0,5%
  csgCrdsTotal: 0.097,

  // Formation professionnelle
  formationPro: 101, // Forfait annuel (0.25% du PASS arrondi)

  // Assiette minimum
  assietteMini: 1_102,
} as const;

// Taux SASU (Président Assimilé salarié)
export const SASU_RATES = {
  chargesPatronalesGlobal: 0.42,
  chargesSalarialesGlobal: 0.22,
  netBrutRatio: 0.78,
} as const;

// Parts fiscales par situation familiale
export const PARTS_FISCALES: Record<string, number> = {
  celibataire: 1,
  marie_sans_enfant: 2,
  marie_1_enfant: 2.5,
  marie_2_enfants: 3,
  marie_3_enfants: 4,
  celibataire_1_enfant: 1.5,
  celibataire_2_enfants: 2,
  celibataire_3_enfants: 3,
};

// Labels pour l'interface
export const SITUATION_LABELS: Record<string, string> = {
  celibataire: "Célibataire",
  marie_sans_enfant: "Marié(e) sans enfant",
  marie_1_enfant: "Marié(e) avec 1 enfant",
  marie_2_enfants: "Marié(e) avec 2 enfants",
  marie_3_enfants: "Marié(e) avec 3 enfants",
  celibataire_1_enfant: "Célibataire avec 1 enfant",
  celibataire_2_enfants: "Célibataire avec 2 enfants",
  celibataire_3_enfants: "Célibataire avec 3 enfants",
};
