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
import type { IsIrInput, SituationFamiliale } from "@/lib/fiscal/types";

interface InputFormProps {
  input: IsIrInput;
  updateField: <K extends keyof IsIrInput>(
    field: K,
    value: IsIrInput[K]
  ) => void;
}

export function IsIrInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres de simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel
            htmlFor="benefice"
            label="Bénéfice annuel (année 1)"
            tooltip="Le bénéfice avant rémunération du dirigeant et avant impôt. CA - charges d'exploitation."
          />
          <CurrencyInput
            id="benefice"
            value={input.beneficeAnnuel}
            onChange={(v) => updateField("beneficeAnnuel", v)}
            placeholder="100 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="croissance"
            label="Taux de croissance annuel"
            tooltip="Pourcentage d'augmentation du bénéfice chaque année pour la projection sur 3 ans."
          />
          <div className="relative">
            <Input
              id="croissance"
              type="number"
              min={-50}
              max={100}
              step={1}
              value={input.tauxCroissance}
              onChange={(e) =>
                updateField(
                  "tauxCroissance",
                  parseFloat(e.target.value) || 0
                )
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
            htmlFor="rem-isir"
            label="Rémunération brute (régime IS)"
            tooltip="Montant brut annuel versé au dirigeant en régime IS. En régime IR, tout le bénéfice constitue la rémunération."
          />
          <CurrencyInput
            id="rem-isir"
            value={input.remunerationBrute}
            onChange={(v) => updateField("remunerationBrute", v)}
            placeholder="60 000"
          />
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="dividendes-part"
            label="Part des dividendes"
            tooltip="Pourcentage du bénéfice après IS distribué en dividendes. Le reste est mis en réserve."
          />
          <div className="relative">
            <Input
              id="dividendes-part"
              type="number"
              min={0}
              max={100}
              step={5}
              value={input.partDividendes}
              onChange={(e) =>
                updateField(
                  "partDividendes",
                  Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                )
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
            htmlFor="situation-isir"
            label="Situation familiale"
            tooltip="Détermine le nombre de parts fiscales pour le calcul de l'IR."
          />
          <Select
            value={input.situationFamiliale}
            onValueChange={(v) =>
              updateField("situationFamiliale", v as SituationFamiliale)
            }
          >
            <SelectTrigger id="situation-isir">
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
