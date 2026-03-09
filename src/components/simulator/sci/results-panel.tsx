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
          subtitle="Sur 5 ans cumules"
          variant="success"
        />
        <ResultCard
          label="Cumul SCI IR (5 ans)"
          value={formatCurrency(result.cumulIR)}
          subtitle="Revenu net apres impots"
        />
        <ResultCard
          label="Cumul SCI IS (5 ans)"
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
          <strong>{formatCurrency(result.economie)}</strong> sur 5 ans.
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
                <TableHead className="w-[200px]">Indicateur</TableHead>
                {result.annees.map((a) => (
                  <TableHead key={a.annee} className="text-center">
                    Annee {a.annee}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Loyers */}
              <TableRow>
                <TableCell className="font-medium">Loyers bruts</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center">
                    {formatCurrency(a.loyers)}
                  </TableCell>
                ))}
              </TableRow>

              {/* IR Section */}
              <TableRow className="bg-blue-50/50">
                <TableCell colSpan={result.annees.length + 1} className="font-semibold text-xs text-blue-700 uppercase tracking-wide">
                  SCI a l&apos;IR
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">Revenu foncier imposable</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-blue-600">
                    {formatCurrency(a.ir.revenuFoncier)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">IR</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-blue-600">
                    {formatCurrency(a.ir.irMontant)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">Prelevements sociaux (17,2%)</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-blue-600">
                    {formatCurrency(a.ir.prelevementsSociaux)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell className="pl-6">Revenu net IR</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-blue-700">
                    {formatCurrency(a.ir.revenuNet)}
                  </TableCell>
                ))}
              </TableRow>

              {/* IS Section */}
              <TableRow className="bg-orange-50/50">
                <TableCell colSpan={result.annees.length + 1} className="font-semibold text-xs text-orange-700 uppercase tracking-wide">
                  SCI a l&apos;IS
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">Cash-flow (loyers - charges)</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-orange-600">
                    {formatCurrency(a.is.cashFlow)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">Resultat fiscal (apres amortissement)</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-orange-600">
                    {formatCurrency(a.is.resultatFiscal)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">IS (15% / 25%)</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-orange-600">
                    {formatCurrency(a.is.montantIS)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">Dividendes bruts distribuables</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-orange-600">
                    {formatCurrency(a.is.dividendesBruts)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6">Flat tax (30%)</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-orange-600">
                    {formatCurrency(a.is.flatTax)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell className="pl-6">Dividendes nets percus</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-orange-700">
                    {formatCurrency(a.is.dividendesNets)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground pl-6 text-xs">Tresorerie restante en SCI</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center text-xs text-muted-foreground">
                    {formatCurrency(a.is.tresorerieRestante)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Comparison */}
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Avantage SCI IS</TableCell>
                {result.annees.map((a) => (
                  <TableCell key={a.annee} className="text-center">
                    <span className={a.avantageSciIS >= 0 ? "text-green-600" : "text-red-500"}>
                      {a.avantageSciIS >= 0 ? "+" : ""}{formatCurrency(a.avantageSciIS)}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Note about depreciation */}
      {result.annees.some((a) => a.is.tresorerieRestante > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            <strong>Note :</strong> L&apos;amortissement reduit le resultat fiscal (et donc l&apos;IS a payer)
            mais n&apos;est pas une sortie de tresorerie. La tresorerie restante dans la SCI IS correspond
            a l&apos;ecart entre le cash-flow reel et les dividendes distribuables. Elle reste disponible
            pour des investissements ou des remboursements d&apos;emprunt.
          </p>
        </div>
      )}

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
