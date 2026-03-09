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
import type { SimulationInput, SituationFamiliale } from "@/lib/fiscal/types";

interface InputFormProps {
  input: SimulationInput;
  updateField: <K extends keyof SimulationInput>(
    field: K,
    value: SimulationInput[K]
  ) => void;
}

export function InputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres de simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel
            htmlFor="ca"
            label="Chiffre d'affaires HT"
            tooltip="Le chiffre d'affaires annuel hors taxes prévu ou réalisé par la société."
          />
          <CurrencyInput
            id="ca"
            value={input.chiffreAffairesHT}
            onChange={(v) => updateField("chiffreAffairesHT", v)}
            placeholder="200 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="charges"
            label="Charges d'exploitation"
            tooltip="Total des charges d'exploitation hors rémunération du dirigeant (loyers, fournisseurs, salariés, etc.)."
          />
          <CurrencyInput
            id="charges"
            value={input.chargesExploitation}
            onChange={(v) => updateField("chargesExploitation", v)}
            placeholder="50 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="remuneration"
            label="Rémunération brute souhaitée"
            tooltip="Le montant brut annuel de rémunération envisagé pour le dirigeant."
          />
          <CurrencyInput
            id="remuneration"
            value={input.remunerationBrute}
            onChange={(v) => updateField("remunerationBrute", v)}
            placeholder="60 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="situation"
            label="Situation familiale"
            tooltip="Détermine le nombre de parts fiscales pour le calcul de l'impôt sur le revenu (quotient familial)."
          />
          <Select
            value={input.situationFamiliale}
            onValueChange={(v) =>
              updateField("situationFamiliale", v as SituationFamiliale)
            }
          >
            <SelectTrigger id="situation">
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

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="age"
            label="Âge du dirigeant"
            tooltip="L'âge peut influencer certaines cotisations et la protection sociale."
          />
          <Input
            id="age"
            type="number"
            min={18}
            max={80}
            value={input.ageDirigeant}
            onChange={(e) =>
              updateField("ageDirigeant", parseInt(e.target.value) || 40)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
