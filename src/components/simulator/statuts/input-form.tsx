"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import type { StatutsInput, SituationFamiliale } from "@/lib/fiscal/types";

interface InputFormProps {
  input: StatutsInput;
  updateField: <K extends keyof StatutsInput>(
    field: K,
    value: StatutsInput[K]
  ) => void;
}

export function StatutsInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres de simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel
            htmlFor="ca-statuts"
            label="Chiffre d'affaires HT"
            tooltip="Le chiffre d'affaires annuel hors taxes prévu ou réalisé."
          />
          <CurrencyInput
            id="ca-statuts"
            value={input.chiffreAffairesHT}
            onChange={(v) => updateField("chiffreAffairesHT", v)}
            placeholder="200 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="charges-statuts"
            label="Charges d'exploitation"
            tooltip="Total des charges hors rémunération du dirigeant."
          />
          <CurrencyInput
            id="charges-statuts"
            value={input.chargesExploitation}
            onChange={(v) => updateField("chargesExploitation", v)}
            placeholder="50 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="rem-statuts"
            label="Rémunération brute souhaitée"
            tooltip="Montant brut annuel pour le dirigeant. Non applicable en EI (le bénéfice est la rémunération)."
          />
          <CurrencyInput
            id="rem-statuts"
            value={input.remunerationBrute}
            onChange={(v) => updateField("remunerationBrute", v)}
            placeholder="60 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="situation-statuts"
            label="Situation familiale"
            tooltip="Détermine le nombre de parts fiscales pour le calcul de l'IR."
          />
          <Select
            value={input.situationFamiliale}
            onValueChange={(v) =>
              updateField("situationFamiliale", v as SituationFamiliale)
            }
          >
            <SelectTrigger id="situation-statuts">
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
