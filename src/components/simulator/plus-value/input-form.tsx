"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/simulator/shared/currency-input";
import { TooltipLabel } from "@/components/simulator/shared/tooltip-label";
import { SITUATION_LABELS } from "@/lib/fiscal/constants";
import type { PlusValueInput, SituationFamiliale, StructureJuridique } from "@/lib/fiscal/types";

interface InputFormProps {
  input: PlusValueInput;
  updateField: <K extends keyof PlusValueInput>(field: K, value: PlusValueInput[K]) => void;
}

export function PlusValueInputForm({ input, updateField }: InputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parametres de cession</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <TooltipLabel htmlFor="prix-acquisition" label="Prix d'acquisition"
            tooltip="Prix d'achat ou valeur d'apport des titres." />
          <CurrencyInput id="prix-acquisition" value={input.prixAcquisition}
            onChange={(v) => updateField("prixAcquisition", v)} placeholder="50 000" />
        </div>

        <div className="space-y-2">
          <TooltipLabel htmlFor="prix-cession" label="Prix de cession"
            tooltip="Prix de vente des titres ou parts sociales." />
          <CurrencyInput id="prix-cession" value={input.prixCession}
            onChange={(v) => updateField("prixCession", v)} placeholder="500 000" />
        </div>

        <div className="space-y-2">
          <TooltipLabel htmlFor="duree-detention" label="Duree de detention (annees)"
            tooltip="Nombre d'annees de detention des titres. Impact les abattements." />
          <div className="relative">
            <Input id="duree-detention" type="number" min={0} max={50} step={1}
              value={input.dureeDetention}
              onChange={(e) => updateField("dureeDetention", parseInt(e.target.value) || 0)}
              className="pr-12" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ans</span>
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel htmlFor="structure-pv" label="Structure juridique"
            tooltip="Type de societe dont les titres sont cedes." />
          <Select value={input.structure}
            onValueChange={(v) => updateField("structure", v as StructureJuridique)}>
            <SelectTrigger id="structure-pv"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SAS">SAS</SelectItem>
              <SelectItem value="SARL">SARL</SelectItem>
              <SelectItem value="EURL">EURL</SelectItem>
              <SelectItem value="SCI">SCI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is-pme" checked={input.isPME}
            onChange={(e) => updateField("isPME", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300" />
          <Label htmlFor="is-pme" className="text-sm">PME (CA &lt; 50M€, &lt; 250 salaries)</Label>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="depart-retraite" checked={input.departRetraite}
            onChange={(e) => updateField("departRetraite", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300" />
          <Label htmlFor="depart-retraite" className="text-sm">Depart a la retraite (abattement 500k€)</Label>
        </div>

        <div className="space-y-2">
          <TooltipLabel htmlFor="situation-pv" label="Situation familiale"
            tooltip="Pour le calcul de l'IR au bareme progressif." />
          <Select value={input.situationFamiliale}
            onValueChange={(v) => updateField("situationFamiliale", v as SituationFamiliale)}>
            <SelectTrigger id="situation-pv"><SelectValue /></SelectTrigger>
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
