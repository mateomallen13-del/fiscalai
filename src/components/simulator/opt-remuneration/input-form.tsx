"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/simulator/shared/currency-input";
import { TooltipLabel } from "@/components/simulator/shared/tooltip-label";
import { SITUATION_LABELS } from "@/lib/fiscal/constants";
import type { OptRemunerationInput, SituationFamiliale } from "@/lib/fiscal/types";

interface InputFormProps {
  input: OptRemunerationInput;
  updateField: <K extends keyof OptRemunerationInput>(field: K, value: OptRemunerationInput[K]) => void;
}

export function OptRemunerationInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parametres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel htmlFor="benefice-opt" label="Benefice de la societe (IS)"
            tooltip="Benefice annuel de la societe soumise a l'IS, avant remuneration du dirigeant." />
          <CurrencyInput id="benefice-opt" value={input.beneficeSociete}
            onChange={(v) => updateField("beneficeSociete", v)} placeholder="150 000" />
        </div>

        <div className="space-y-2">
          <TooltipLabel htmlFor="revenu-cible" label="Revenu net souhaite (optionnel)"
            tooltip="Revenu net souhaite par le dirigeant. Permet de voir la repartition optimale pour atteindre ce montant." />
          <CurrencyInput id="revenu-cible" value={input.revenuCibleNet}
            onChange={(v) => updateField("revenuCibleNet", v)} placeholder="80 000" />
        </div>

        <div className="space-y-2">
          <TooltipLabel htmlFor="situation-opt" label="Situation familiale"
            tooltip="Determine le nombre de parts fiscales pour le calcul de l'IR sur le salaire." />
          <Select value={input.situationFamiliale}
            onValueChange={(v) => updateField("situationFamiliale", v as SituationFamiliale)}>
            <SelectTrigger id="situation-opt"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(SITUATION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
