"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ResultCard } from "@/components/simulator/shared/result-card";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import { formatCurrency } from "@/lib/formatters";
import type { HoldingInput, HoldingResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: HoldingInput;
  result: HoldingResult | null;
  loading: boolean;
  isValid: boolean;
}

export function HoldingResultsPanel({ input, result, loading, isValid }: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>Renseignez le benefice et la remuneration pour lancer la simulation.</p>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { sansHolding, avecHolding } = result;

  return (
    <div className="space-y-6" id="results-panel">
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Recommandation"
          value={result.recommandation === "avec_holding" ? "Avec holding" : "Sans holding"}
          subtitle={`Economie de ${formatCurrency(result.economie)}`}
          variant="success"
        />
        <ResultCard
          label="Revenu sans holding"
          value={formatCurrency(sansHolding.revenuTotal)}
          subtitle="Revenu net dirigeant"
        />
        <ResultCard
          label="Revenu avec holding"
          value={formatCurrency(avecHolding.revenuTotal)}
          subtitle="Revenu net dirigeant"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Badge className="bg-green-500 hover:bg-green-600">
          {result.recommandation === "avec_holding" ? "Holding" : "Direct"}
        </Badge>
        <p className="text-sm">
          La structure <strong>{result.recommandation === "avec_holding" ? "avec holding" : "directe"}</strong>{" "}
          est plus avantageuse avec une economie de <strong>{formatCurrency(result.economie)}</strong>.
        </p>
      </div>

      {/* Reasons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {result.raisons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Direct structure detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Structure directe (sans holding)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Benefice</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.benefice)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Remuneration nette</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.remunerationNette)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IR sur remuneration</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.irRemuneration)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IS</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.is)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividendes bruts</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.dividendesBruts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Flat tax (30%)</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.flatTax)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividendes nets</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.dividendesNets)}</TableCell>
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Revenu total dirigeant</TableCell>
                <TableCell className="text-right">{formatCurrency(sansHolding.revenuTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Holding structure detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Structure avec holding</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow className="bg-muted/30">
                <TableCell colSpan={2} className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                  Filiale
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Benefice filiale</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.beneficeFiliale)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IS filiale</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.isFiliale)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividendes verses a la holding</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.dividendesVersesHolding)}</TableCell>
              </TableRow>

              <TableRow className="bg-muted/30">
                <TableCell colSpan={2} className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                  Holding (regime mere-fille)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Quote-part frais (5%)</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.quotePartFrais)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IS holding</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.isHolding)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Charges holding</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.chargesHolding)}</TableCell>
              </TableRow>
              {avecHolding.remunerationHoldingNette > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Remuneration depuis holding (nette)</TableCell>
                  <TableCell className="text-right">{formatCurrency(avecHolding.remunerationHoldingNette)}</TableCell>
                </TableRow>
              )}

              <TableRow className="bg-muted/30">
                <TableCell colSpan={2} className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                  Dirigeant
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IR total</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.irHolding)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividendes holding bruts</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.dividendesHoldingBruts)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Flat tax holding (30%)</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.flatTaxHolding)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividendes holding nets</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.dividendesHoldingNets)}</TableCell>
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Revenu total dirigeant</TableCell>
                <TableCell className="text-right">{formatCurrency(avecHolding.revenuTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton type="holding" inputData={input} resultData={result} />
        <PdfExportButton
          data={{ type: "holding", result }}
          reportTitle="Simulation Holding — Regime Mere-Fille"
          filename="simulation-holding-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
