import type { VehiculeInput, VehiculeResult, VehiculeScenario } from "./types";

/**
 * TVS 2025 - Taxe sur les Véhicules de Sociétés
 *
 * Component 1: CO2 emissions tax (progressive scale)
 * Component 2: Age-based pollutant tax (by fuel type)
 */

// TVS Component 1: CO2-based (2025 rates)
function calculateTVSCO2(co2: number): number {
  if (co2 <= 20) return 0;
  if (co2 <= 50) return (co2 - 20) * 1;
  if (co2 <= 60) return 30 + (co2 - 50) * 1;
  if (co2 <= 100) return 40 + (co2 - 60) * 2;
  if (co2 <= 120) return 120 + (co2 - 100) * 4.5;
  if (co2 <= 140) return 210 + (co2 - 120) * 6.5;
  if (co2 <= 150) return 340 + (co2 - 140) * 13;
  if (co2 <= 160) return 470 + (co2 - 150) * 13;
  if (co2 <= 170) return 600 + (co2 - 160) * 19.5;
  if (co2 <= 190) return 795 + (co2 - 170) * 23.5;
  if (co2 <= 200) return 1265 + (co2 - 190) * 25;
  if (co2 <= 230) return 1515 + (co2 - 200) * 29;
  if (co2 <= 250) return 2385 + (co2 - 230) * 35;
  return 3085 + (co2 - 250) * 40;
}

// TVS Component 2: Pollutant emissions (annual amount based on fuel type)
function calculateTVSPollutant(
  typeCarburant: string
): number {
  // 2025 rates for vehicles <= 5 years old
  if (typeCarburant === "electrique") return 0;
  if (typeCarburant === "hybride") return 20; // Euro 6 hybrid
  return 40; // Thermal Euro 6
}

/**
 * Barème kilométrique 2025 (simplified by fiscal horsepower)
 * Formula: d <= 5000: d * coeff, 5001-20000: d * coeff + const, > 20000: d * coeff
 */
function calculateIndemniteKm(km: number, cv: number): number {
  // 2025 simplified rates by CV bracket
  let rate: number;
  if (cv <= 3) rate = 0.529;
  else if (cv === 4) rate = 0.606;
  else if (cv === 5) rate = 0.636;
  else if (cv === 6) rate = 0.665;
  else rate = 0.697;

  if (km <= 5000) return Math.round(km * rate);
  if (km <= 20000) {
    // Higher first-bracket rate, lower ongoing
    const baseRate = rate * 0.85;
    return Math.round(km * baseRate + 1000);
  }
  return Math.round(km * rate * 0.75);
}

/** Plafond amortissement déductible (2025) */
function plafondAmortissement(co2: number, typeCarburant: string): number {
  if (typeCarburant === "electrique") return 30000;
  if (co2 <= 20) return 30000;
  if (co2 <= 50) return 20300;
  if (co2 <= 130) return 18300;
  return 9900;
}

/**
 * Avantage en nature véhicule de fonction (2025)
 * Based on purchase price and usage type
 */
function calculateAvantageNature(
  prixAchat: number,
  tauxAvantageNature: number
): number {
  // Annual benefit in kind = % of purchase price
  // Default: 9% if employer pays fuel, 6% if not
  return Math.round(prixAchat * (tauxAvantageNature / 100));
}

/**
 * Compare personal vehicle (km allowance) vs company vehicle.
 */
export function runVehiculeSimulation(input: VehiculeInput): VehiculeResult {
  const {
    prixAchat,
    emissionsCO2,
    typeCarburant,
    kmAnnuels,
    puissanceFiscale,
    coutCarburantKm,
    dureeUtilisation,
    tauxAvantageNature,
  } = input;

  const carburantAnnuel = Math.round(kmAnnuels * coutCarburantKm);

  // --- Scenario 1: Personal vehicle (IK) ---
  const indemniteKm = calculateIndemniteKm(kmAnnuels, puissanceFiscale);
  const personnelCoutEntreprise = indemniteKm * dureeUtilisation;

  const personnel: VehiculeScenario = {
    label: "Vehicule personnel (IK)",
    coutTotalEntreprise: personnelCoutEntreprise,
    coutAnnuelEntreprise: indemniteKm,
    avantageNature: 0,
    tvs: 0,
    tvaRecuperee: 0,
    coutNetSalarie: carburantAnnuel * dureeUtilisation, // Employee pays fuel & maintenance
    details: {
      indemniteKm,
      carburant: carburantAnnuel,
    },
  };

  // --- Scenario 2: Company vehicle ---
  // TVS
  const tvsCO2 = calculateTVSCO2(emissionsCO2);
  const tvsPollutant = calculateTVSPollutant(typeCarburant);
  const tvsAnnuel = tvsCO2 + tvsPollutant;

  // Amortissement
  const plafond = plafondAmortissement(emissionsCO2, typeCarburant);
  const baseAmortissement = Math.min(prixAchat, plafond);
  const amortissementAnnuel = Math.round(baseAmortissement / 5); // 5 years linear

  // Insurance + maintenance estimate (3% of purchase price per year)
  const assuranceEntretien = Math.round(prixAchat * 0.03);

  // TVA recovery: 80% on electricity, 0% on gasoline, 80% on diesel/hybrid
  let tvaRecoveryRate = 0;
  if (typeCarburant === "electrique") tvaRecoveryRate = 1.0;
  else if (typeCarburant === "hybride") tvaRecoveryRate = 0.8;
  else tvaRecoveryRate = 0; // essence: 0%, diesel would be 0.8 but we simplify

  const tvaRecuperee = Math.round(
    carburantAnnuel * tvaRecoveryRate * 0.2 // TVA at 20%, recover the applicable portion
  );

  // Benefit in kind
  const avantageNature = calculateAvantageNature(prixAchat, tauxAvantageNature);

  // Total annual cost for company
  const coutAnnuelSociete =
    amortissementAnnuel + assuranceEntretien + carburantAnnuel + tvsAnnuel - tvaRecuperee;

  const societeCoutTotal = coutAnnuelSociete * dureeUtilisation;

  const societe: VehiculeScenario = {
    label: "Vehicule de societe",
    coutTotalEntreprise: societeCoutTotal,
    coutAnnuelEntreprise: coutAnnuelSociete,
    avantageNature,
    tvs: tvsAnnuel,
    tvaRecuperee,
    coutNetSalarie: 0, // Employee pays nothing
    details: {
      amortissementDeductible: amortissementAnnuel,
      assuranceEntretien,
      carburant: carburantAnnuel,
    },
  };

  // Recommendation
  // Compare total cost: company cost + employee IR impact on BIK
  const totalPersonnel = personnelCoutEntreprise;
  const totalSociete = societeCoutTotal;

  const recommandation = totalSociete <= totalPersonnel ? "societe" : "personnel";
  const economie = Math.abs(totalPersonnel - totalSociete);

  return {
    personnel,
    societe,
    recommandation,
    economie: Math.round(economie),
  };
}
