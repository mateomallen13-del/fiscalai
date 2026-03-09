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

export interface IsIrResult {
  annees: IsIrAnnee[];
  cumulIS: number;
  cumulIR: number;
  regimeRecommande: "IS" | "IR";
  economie: number;
}
