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
import { SITUATION_LABELS } from "@/lib/fiscal/constants";
import type { SciInput, SituationFamiliale } from "@/lib/fiscal/types";

interface InputFormProps {
  input: SciInput;
  updateField: <K extends keyof SciInput>(field: K, value: SciInput[K]) => void;
}

export function SciInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parametres SCI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel
            htmlFor="loyers"
            label="Loyers annuels bruts"
            tooltip="Total des loyers encaisses par la SCI sur l'annee."
          />
          <CurrencyInput
            id="loyers"
            value={input.loyersAnnuels}
            onChange={(v) => updateField("loyersAnnuels", v)}
            placeholder="24 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="charges-sci"
            label="Charges d'exploitation"
            tooltip="Taxe fonciere, assurance, frais de gestion, entretien courant."
          />
          <CurrencyInput
            id="charges-sci"
            value={input.chargesExploitation}
            onChange={(v) => updateField("chargesExploitation", v)}
            placeholder="3 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="interets"
            label="Interets d'emprunt"
            tooltip="Interets annuels du pret immobilier deductibles des revenus."
          />
          <CurrencyInput
            id="interets"
            value={input.interetsEmprunt}
            onChange={(v) => updateField("interetsEmprunt", v)}
            placeholder="5 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="travaux"
            label="Travaux deductibles"
            tooltip="Travaux d'entretien et de reparation deductibles (IR et IS)."
          />
          <CurrencyInput
            id="travaux"
            value={input.travauxDeductibles}
            onChange={(v) => updateField("travauxDeductibles", v)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="amortissement"
            label="Amortissement annuel"
            tooltip="Amortissement du bien immobilier. Deductible uniquement en SCI IS (pas en SCI IR)."
          />
          <CurrencyInput
            id="amortissement"
            value={input.amortissementAnnuel}
            onChange={(v) => updateField("amortissementAnnuel", v)}
            placeholder="4 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="croissance-sci"
            label="Revalorisation loyers (%)"
            tooltip="Pourcentage d'augmentation annuelle des loyers."
          />
          <div className="relative">
            <Input
              id="croissance-sci"
              type="number"
              min={-10}
              max={20}
              step={0.5}
              value={input.tauxCroissance}
              onChange={(e) => updateField("tauxCroissance", parseFloat(e.target.value) || 0)}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="parts-sci"
            label="Parts SCI detenues (%)"
            tooltip="Pourcentage des parts de la SCI que vous detenez."
          />
          <div className="relative">
            <Input
              id="parts-sci"
              type="number"
              min={1}
              max={100}
              step={1}
              value={input.partsSCI}
              onChange={(e) =>
                updateField("partsSCI", Math.min(100, Math.max(1, parseFloat(e.target.value) || 100)))
              }
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="situation-sci"
            label="Situation familiale"
            tooltip="Determine le nombre de parts fiscales pour le calcul de l'IR (SCI IR)."
          />
          <Select
            value={input.situationFamiliale}
            onValueChange={(v) => updateField("situationFamiliale", v as SituationFamiliale)}
          >
            <SelectTrigger id="situation-sci">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SITUATION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
