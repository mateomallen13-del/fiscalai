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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultCard } from "@/components/simulator/shared/result-card";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import { formatCurrency } from "@/lib/formatters";
import type { SciInput, SciResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: SciInput;
  result: SciResult | null;
  loading: boolean;
  isValid: boolean;
}

export function SciResultsPanel({ input, result, loading, isValid }: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>Renseignez les loyers annuels pour lancer la simulation.</p>
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

  return (
    <div className="space-y-6" id="results-panel">
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Regime recommande"
          value={result.regimeRecommande === "IS" ? "SCI a l'IS" : "SCI a l'IR"}
          subtitle="Sur 3 ans cumules"
          variant="success"
        />
        <ResultCard
          label="Cumul SCI IR (3 ans)"
          value={formatCurrency(result.cumulIR)}
          subtitle="Revenu net apres impots"
        />
        <ResultCard
          label="Cumul SCI IS (3 ans)"
          value={formatCurrency(result.cumulIS)}
          subtitle="Dividendes nets percus"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Badge className="bg-green-500 hover:bg-green-600">
          SCI {result.regimeRecommande}
        </Badge>
        <p className="text-sm">
          La <strong>SCI a l&apos;{result.regimeRecommande}</strong> vous fait economiser{" "}
          <strong>{formatCurrency(result.economie)}</strong> sur 3 ans.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail annee par annee</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Indicateur</TableHead>
                {result.annees.map((a) => (
                  <TableHead key={a.annee} className="text-center">
                    <div className="flex gap-2 justify-center">
                      <span className="text-blue-600">IR An {a.annee}</span>
                      <span className="text-orange-600">IS An {a.annee}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Loyers</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center">
                    {formatCurrency(a.loyers)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Base imposable</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-xs">
                    <div className="flex gap-3 justify-center">
                      <span className="text-blue-600">{formatCurrency(a.ir.revenuFoncier)}</span>
                      <span className="text-orange-600">{formatCurrency(a.is.resultatComptable)}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Impots + PS</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-xs">
                    <div className="flex gap-3 justify-center">
                      <span className="text-blue-600">
                        {formatCurrency(a.ir.irMontant + a.ir.prelevementsSociaux)}
                      </span>
                      <span className="text-orange-600">
                        {formatCurrency(a.is.montantIS + a.is.flatTax)}
                      </span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Revenu net</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-xs">
                    <div className="flex gap-3 justify-center">
                      <span className="text-blue-600">{formatCurrency(a.ir.revenuNet)}</span>
                      <span className="text-orange-600">{formatCurrency(a.is.dividendesNets)}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Avantage SCI IS</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center">
                    <span className={a.avantageSciIS >= 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                      {a.avantageSciIS >= 0 ? "+" : ""}{formatCurrency(a.avantageSciIS)}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton type="sci" inputData={input} resultData={result} />
        <PdfExportButton
          data={{ type: "sci", result }}
          reportTitle="Simulation SCI — IR vs IS"
          filename="simulation-sci-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
