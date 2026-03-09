"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ResultCard } from "@/components/simulator/shared/result-card";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { PlusValueInput, PlusValueResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: PlusValueInput;
  result: PlusValueResult | null;
  loading: boolean;
  isValid: boolean;
}

export function PlusValueResultsPanel({ input, result, loading, isValid }: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>Renseignez le prix d&apos;acquisition et de cession pour lancer la simulation.</p>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const best = result.recommandation === "flat_tax" ? result.flatTax : result.bareme;

  return (
    <div className="space-y-6" id="results-panel">
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="Plus-value brute" value={formatCurrency(result.plusValueBrute)} subtitle="Gain de cession" />
        <ResultCard label="Regime optimal" value={best.label} subtitle={`Net: ${formatCurrency(best.netApresImpot)}`} variant="success" />
        <ResultCard label="Economie" value={formatCurrency(result.economie)} subtitle="vs l'autre regime" />
      </div>

      {result.exonerationPME && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <Badge className="bg-green-500 hover:bg-green-600">Exoneration</Badge>
          <p className="text-sm">
            <strong>Exoneration PME depart retraite</strong> applicable.
            Seuls les prelevements sociaux (17,2%) s&apos;appliquent.
          </p>
        </div>
      )}

      {!result.exonerationPME && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <Badge className="bg-green-500 hover:bg-green-600">{result.recommandation === "flat_tax" ? "Flat tax" : "Bareme"}</Badge>
          <p className="text-sm">
            Le <strong>{best.label}</strong> est plus avantageux avec une economie
            de <strong>{formatCurrency(result.economie)}</strong>.
          </p>
        </div>
      )}

      {/* Flat tax detail */}
      <Card>
        <CardHeader><CardTitle className="text-base">Flat tax (PFU 30%)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="font-medium">Plus-value brute</TableCell><TableCell className="text-right">{formatCurrency(result.flatTax.plusValueBrute)}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Abattement</TableCell><TableCell className="text-right">Aucun (flat tax)</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Impot (30%)</TableCell><TableCell className="text-right">{formatCurrency(result.flatTax.impot)}</TableCell></TableRow>
              <TableRow className="font-bold bg-muted/50"><TableCell>Net percu</TableCell><TableCell className="text-right">{formatCurrency(result.flatTax.netApresImpot)}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bareme detail */}
      <Card>
        <CardHeader><CardTitle className="text-base">Bareme progressif IR</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow><TableCell className="font-medium">Plus-value brute</TableCell><TableCell className="text-right">{formatCurrency(result.bareme.plusValueBrute)}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Abattement duree ({formatPercent(result.bareme.tauxAbattement)})</TableCell><TableCell className="text-right">-{formatCurrency(result.bareme.abattement)}</TableCell></TableRow>
              {result.bareme.abattementRetraite > 0 && (
                <TableRow><TableCell className="font-medium">Abattement retraite (500k€)</TableCell><TableCell className="text-right">-{formatCurrency(result.bareme.abattementRetraite)}</TableCell></TableRow>
              )}
              <TableRow><TableCell className="font-medium">Base imposable IR</TableCell><TableCell className="text-right">{formatCurrency(result.bareme.plusValueImposable)}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">IR (bareme progressif)</TableCell><TableCell className="text-right">{formatCurrency(result.bareme.impot)}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Prelevements sociaux (17,2%)</TableCell><TableCell className="text-right">{formatCurrency(result.bareme.prelevementsSociaux)}</TableCell></TableRow>
              <TableRow className="font-bold bg-muted/50"><TableCell>Net percu</TableCell><TableCell className="text-right">{formatCurrency(result.bareme.netApresImpot)}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton type="plus_value" inputData={input} resultData={result} />
        <PdfExportButton data={{ type: "plus_value", result }} reportTitle="Simulation Plus-Value de Cession" filename="simulation-plus-value-fiscalai.pdf" />
      </div>
    </div>
  );
}
