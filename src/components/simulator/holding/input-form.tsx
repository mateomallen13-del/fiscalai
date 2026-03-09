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
import type { HoldingInput, SituationFamiliale } from "@/lib/fiscal/types";

interface InputFormProps {
  input: HoldingInput;
  updateField: <K extends keyof HoldingInput>(field: K, value: HoldingInput[K]) => void;
}

export function HoldingInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parametres holding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel
            htmlFor="benefice-filiale"
            label="Benefice de la filiale"
            tooltip="Benefice annuel de la societe operationnelle (filiale) avant remuneration du dirigeant."
          />
          <CurrencyInput
            id="benefice-filiale"
            value={input.beneficeFiliale}
            onChange={(v) => updateField("beneficeFiliale", v)}
            placeholder="200 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="rem-gerant"
            label="Remuneration du gerant"
            tooltip="Remuneration brute annuelle versee par la filiale au dirigeant."
          />
          <CurrencyInput
            id="rem-gerant"
            value={input.remunerationGerant}
            onChange={(v) => updateField("remunerationGerant", v)}
            placeholder="60 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="div-holding"
            label="Dividendes verses a la holding (%)"
            tooltip="Part du benefice apres IS de la filiale remontee en dividendes a la holding."
          />
          <div className="relative">
            <Input
              id="div-holding"
              type="number"
              min={0}
              max={100}
              step={5}
              value={input.dividendesVersesHolding}
              onChange={(e) =>
                updateField("dividendesVersesHolding", Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))
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
            htmlFor="charges-holding"
            label="Charges annuelles holding"
            tooltip="Frais de fonctionnement annuels de la holding (comptabilite, domiciliation, etc.)."
          />
          <CurrencyInput
            id="charges-holding"
            value={input.chargesHolding}
            onChange={(v) => updateField("chargesHolding", v)}
            placeholder="5 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="rem-holding"
            label="Remuneration depuis la holding"
            tooltip="Remuneration brute supplementaire versee par la holding au dirigeant (optionnel)."
          />
          <CurrencyInput
            id="rem-holding"
            value={input.remunerationDepuisHolding}
            onChange={(v) => updateField("remunerationDepuisHolding", v)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="situation-holding"
            label="Situation familiale"
            tooltip="Determine le nombre de parts fiscales pour le calcul de l'IR."
          />
          <Select
            value={input.situationFamiliale}
            onValueChange={(v) => updateField("situationFamiliale", v as SituationFamiliale)}
          >
            <SelectTrigger id="situation-holding">
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
