export type SituationFamiliale =
  | "celibataire"
  | "marie_sans_enfant"
  | "marie_1_enfant"
  | "marie_2_enfants"
  | "marie_3_enfants"
  | "celibataire_1_enfant"
  | "celibataire_2_enfants"
  | "celibataire_3_enfants";

export interface SimulationInput {
  chiffreAffairesHT: number;
  chargesExploitation: number;
  remunerationBrute: number;
  situationFamiliale: SituationFamiliale;
  ageDirigeant: number;
}

export interface ChargesDetailTNS {
  maladieMaterinte: number;
  indemniteJournalieres: number;
  retraiteBase: number;
  retraiteComplementaire: number;
  invaliditeDeces: number;
  allocationsFamiliales: number;
  csgCrds: number;
  formationPro: number;
  total: number;
}

export interface TNSResult {
  remunerationBrute: number;
  chargesSociales: ChargesDetailTNS;
  netAvantIR: number;
  coutTotalEntreprise: number;
}

export interface SASUResult {
  remunerationBrute: number;
  chargesSalariales: number;
  chargesPatronales: number;
  netAvantIR: number;
  coutTotalEntreprise: number;
}

export interface IRDetail {
  tranche: string;
  montant: number;
  taux: number;
}

export interface IRResult {
  revenuImposable: number;
  nbParts: number;
  revenuParPart: number;
  impotNet: number;
  tauxMoyen: number;
  tauxMarginal: number;
  detailParTranche: IRDetail[];
  reductionQuotient: number; // savings from quotient familial vs 1 part
}

export interface ISResult {
  beneficeImposable: number;
  montant: number;
  tauxEffectif: number;
}

export interface DividendesResult {
  montantBrut: number;
  flatTax: number;
  montantNet: number;
}

export interface ScenarioResult {
  regime: "TNS" | "SASU";
  remunerationBrute: number;
  chargesSociales: number;
  chargesDetail: ChargesDetailTNS | { salariales: number; patronales: number };
  netAvantIR: number;
  ir: IRResult;
  netApresIR: number;
  coutTotalEntreprise: number;
  beneficeResiduel: number;
  is: ISResult;
  dividendes: DividendesResult;
  revenuTotalDirigeant: number;
}

export interface SimulationResult {
  tns: ScenarioResult;
  sasu: ScenarioResult;
  economie: number;
  regimeRecommande: "TNS" | "SASU";
}

// --- Comparateur Statuts Juridiques ---

export type StatutJuridique = "EI" | "EURL" | "SASU" | "SAS";

export interface StatutsInput {
  chiffreAffairesHT: number;
  chargesExploitation: number;
  remunerationBrute: number;
  situationFamiliale: SituationFamiliale;
}

export interface ProtectionSociale {
  retraite: "Faible" | "Moyenne" | "Bonne";
  prevoyance: "Faible" | "Moyenne" | "Bonne";
  indemniteJournaliere: boolean;
  assuranceChomage: boolean;
}

export interface StatutResult {
  statut: StatutJuridique;
  label: string;
  chargesSociales: number;
  tauxCharges: number;
  imposition: {
    type: "IS" | "IR";
    montantIS: number;
    montantIR: number;
    dividendesBruts: number;
    flatTax: number;
    dividendesNets: number;
  };
  netDisponible: number;
  coutTotalEntreprise: number;
  protectionSociale: ProtectionSociale;
}

export interface StatutsResult {
  statuts: StatutResult[];
  recommandation: {
    statut: StatutJuridique;
    raisons: string[];
  };
}

// --- Simulation IS vs IR ---

export interface IsIrInput {
  beneficeAnnuel: number;
  tauxCroissance: number; // % per year
  remunerationBrute: number;
  situationFamiliale: SituationFamiliale;
  partDividendes: number; // % of profit after IS distributed as dividends
}

export interface IsIrAnnee {
  annee: number;
  benefice: number;
  // Régime IS
  is: {
    remunerationNette: number;
    chargesSociales: number;
    coutRemuneration: number;
    beneficeResiduel: number;
    montantIS: number;
    dividendesBruts: number;
    flatTax: number;
    dividendesNets: number;
    reserves: number;
    revenuTotalDirigeant: number;
    irSurRemuneration: number;
  };
  // Régime IR
  ir: {
    beneficeImposable: number;
    chargesSociales: number;
    revenuNet: number;
    montantIR: number;
    revenuApresIR: number;
  };
  avantageIS: number;
}

export interface OptimalSplitPoint {
  salaireBrut: number;
  dividendes: number;
  chargesSociales: number;
  ir: number;
  flatTax: number;
  is: number;
  revenuNet: number;
}

export interface IsIrResult {
  annees: IsIrAnnee[];
  cumulIS: number;
  cumulIR: number;
  regimeRecommande: "IS" | "IR";
  economie: number;
  optimalSplit: OptimalSplitPoint; // optimal salary vs dividends
  splitCurve: OptimalSplitPoint[]; // curve data for chart
}

// --- SCI Simulator ---

export interface SciInput {
  loyersAnnuels: number;
  chargesExploitation: number;
  interetsEmprunt: number;
  travauxDeductibles: number;
  amortissementAnnuel: number; // Only for IS
  tauxCroissance: number; // %
  situationFamiliale: SituationFamiliale;
  partsSCI: number; // % ownership (0-100)
}

export interface SciAnnee {
  annee: number;
  loyers: number;
  // SCI IR
  ir: {
    revenuFoncier: number; // loyers - charges - interets - travaux
    irMontant: number;
    prelevementsSociaux: number; // 17.2%
    revenuNet: number;
  };
  // SCI IS
  is: {
    resultatFiscal: number; // loyers - charges - interets - travaux - amortissement (taxable)
    cashFlow: number; // loyers - charges - interets - travaux (actual cash, no depreciation)
    montantIS: number;
    dividendesBruts: number; // min(cashFlow - IS, resultatFiscal - IS) — distributable
    flatTax: number;
    dividendesNets: number;
    tresorerieRestante: number; // cash kept in SCI (non-distributable excess from depreciation)
  };
  avantageSciIS: number;
}

export interface SciResult {
  annees: SciAnnee[];
  cumulIR: number;
  cumulIS: number;
  regimeRecommande: "IR" | "IS";
  economie: number;
}

// --- Vehicle Simulator ---

export type TypeCarburant = "thermique" | "electrique" | "hybride";

export interface VehiculeInput {
  prixAchat: number;
  emissionsCO2: number; // g/km
  typeCarburant: TypeCarburant;
  kmAnnuels: number;
  puissanceFiscale: number; // CV
  coutCarburantKm: number; // €/km
  dureeUtilisation: number; // years (1-5)
  tauxAvantageNature: number; // % of vehicle price for BIK
}

export interface VehiculeScenario {
  label: string;
  coutTotalEntreprise: number;
  coutAnnuelEntreprise: number;
  avantageNature: number; // Benefit in kind (company vehicle only)
  tvs: number;
  tvaRecuperee: number;
  coutNetSalarie: number;
  details: {
    indemniteKm?: number;
    amortissementDeductible?: number;
    assuranceEntretien?: number;
    carburant: number;
  };
}

export interface VehiculeResult {
  personnel: VehiculeScenario;
  societe: VehiculeScenario;
  recommandation: "personnel" | "societe";
  economie: number;
}

// --- Holding Simulator ---

export interface HoldingInput {
  beneficeFiliale: number;
  remunerationGerant: number;
  dividendesVersesHolding: number; // % of profit after IS
  chargesHolding: number; // holding operating costs
  situationFamiliale: SituationFamiliale;
  remunerationDepuisHolding: number; // additional salary from holding
}

export interface HoldingResult {
  sansHolding: {
    benefice: number;
    is: number;
    dividendesBruts: number;
    flatTax: number;
    dividendesNets: number;
    remunerationNette: number;
    irRemuneration: number;
    revenuTotal: number;
  };
  avecHolding: {
    // Filiale
    beneficeFiliale: number;
    isFiliale: number;
    dividendesVersesHolding: number;
    // Holding (parent-subsidiary: 95% exemption)
    quotePartFrais: number; // 5% taxable
    isHolding: number;
    chargesHolding: number;
    tresorerieHolding: number;
    // Remuneration from holding
    remunerationHoldingNette: number;
    irHolding: number;
    // Dividendes from holding to individual
    dividendesHoldingBruts: number;
    flatTaxHolding: number;
    dividendesHoldingNets: number;
    revenuTotal: number;
  };
  economie: number;
  recommandation: "sans_holding" | "avec_holding";
  raisons: string[];
}

// --- Capital Gains (Plus-Value Cession) ---

export type StructureJuridique = "SARL" | "SAS" | "SCI" | "EURL";

export interface PlusValueInput {
  prixAcquisition: number;
  prixCession: number;
  dureeDetention: number; // years
  structure: StructureJuridique;
  departRetraite: boolean;
  isPME: boolean; // PME < 10M€ CA
  situationFamiliale: SituationFamiliale;
}

export interface PlusValueScenario {
  label: string;
  plusValueBrute: number;
  abattement: number;
  tauxAbattement: number;
  plusValueImposable: number;
  impot: number;
  prelevementsSociaux: number;
  abattementRetraite: number;
  netApresImpot: number;
}

export interface PlusValueResult {
  plusValueBrute: number;
  flatTax: PlusValueScenario;
  bareme: PlusValueScenario;
  recommandation: "flat_tax" | "bareme";
  economie: number;
  exonerationPME: boolean;
  exonerationMontant: number;
}

// --- Optimal Remuneration ---

export interface OptRemunerationInput {
  beneficeSociete: number;
  revenuCibleNet: number;
  situationFamiliale: SituationFamiliale;
}

export interface OptRemunerationPoint {
  salaireBrut: number;
  salaireNet: number;
  chargesSociales: number;
  ir: number;
  dividendesBruts: number;
  flatTax: number;
  dividendesNets: number;
  is: number;
  revenuNetTotal: number;
  coutEntreprise: number;
}

export interface OptRemunerationResult {
  optimal: OptRemunerationPoint;
  toutSalaire: OptRemunerationPoint;
  toutDividendes: OptRemunerationPoint;
  courbe: OptRemunerationPoint[];
  economieVsToutSalaire: number;
  economieVsToutDividendes: number;
}
