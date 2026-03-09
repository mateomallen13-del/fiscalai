"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/simulator/shared/currency-input";
import { TooltipLabel } from "@/components/simulator/shared/tooltip-label";
import type { VehiculeInput, TypeCarburant } from "@/lib/fiscal/types";

interface InputFormProps {
  input: VehiculeInput;
  updateField: <K extends keyof VehiculeInput>(field: K, value: VehiculeInput[K]) => void;
}

const CARBURANT_LABELS: Record<TypeCarburant, string> = {
  thermique: "Thermique (essence/diesel)",
  electrique: "Electrique",
  hybride: "Hybride rechargeable",
};

export function VehiculeInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parametres vehicule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel
            htmlFor="prix-achat"
            label="Prix d'achat TTC"
            tooltip="Prix d'achat du vehicule toutes taxes comprises."
          />
          <CurrencyInput
            id="prix-achat"
            value={input.prixAchat}
            onChange={(v) => updateField("prixAchat", v)}
            placeholder="35 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="type-carburant"
            label="Type de carburant"
            tooltip="Impact la TVS, la recuperation de TVA et le plafond d'amortissement."
          />
          <Select
            value={input.typeCarburant}
            onValueChange={(v) => updateField("typeCarburant", v as TypeCarburant)}
          >
            <SelectTrigger id="type-carburant">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CARBURANT_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="co2"
            label="Emissions CO2 (g/km)"
            tooltip="Emissions de CO2 du vehicule. Determine la TVS et le plafond d'amortissement."
          />
          <div className="relative">
            <Input
              id="co2"
              type="number"
              min={0}
              max={400}
              step={1}
              value={input.emissionsCO2}
              onChange={(e) => updateField("emissionsCO2", parseInt(e.target.value) || 0)}
              className="pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              g/km
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="km-annuels"
            label="Kilometres annuels"
            tooltip="Distance parcourue par an a titre professionnel."
          />
          <div className="relative">
            <Input
              id="km-annuels"
              type="number"
              min={0}
              max={100000}
              step={1000}
              value={input.kmAnnuels}
              onChange={(e) => updateField("kmAnnuels", parseInt(e.target.value) || 0)}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              km
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="cv"
            label="Puissance fiscale"
            tooltip="Puissance fiscale en chevaux fiscaux (CV). Utilise pour le bareme kilometrique."
          />
          <div className="relative">
            <Input
              id="cv"
              type="number"
              min={1}
              max={30}
              step={1}
              value={input.puissanceFiscale}
              onChange={(e) => updateField("puissanceFiscale", parseInt(e.target.value) || 1)}
              className="pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              CV
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="cout-km"
            label="Cout carburant (€/km)"
            tooltip="Cout moyen du carburant par kilometre parcouru."
          />
          <div className="relative">
            <Input
              id="cout-km"
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={input.coutCarburantKm}
              onChange={(e) => updateField("coutCarburantKm", parseFloat(e.target.value) || 0)}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              €/km
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="duree"
            label="Duree d'utilisation"
            tooltip="Nombre d'annees prevues d'utilisation du vehicule."
          />
          <div className="relative">
            <Input
              id="duree"
              type="number"
              min={1}
              max={10}
              step={1}
              value={input.dureeUtilisation}
              onChange={(e) => updateField("dureeUtilisation", parseInt(e.target.value) || 1)}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ans
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="taux-ain"
            label="Taux avantage en nature (%)"
            tooltip="Pourcentage du prix d'achat utilise pour calculer l'avantage en nature. 9% avec carburant, 6% sans."
          />
          <div className="relative">
            <Input
              id="taux-ain"
              type="number"
              min={0}
              max={30}
              step={1}
              value={input.tauxAvantageNature}
              onChange={(e) => updateField("tauxAvantageNature", parseFloat(e.target.value) || 0)}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
