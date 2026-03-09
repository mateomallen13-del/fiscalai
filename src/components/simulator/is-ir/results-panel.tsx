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
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { ResultCard } from "@/components/simulator/shared/result-card";
import { YearChart } from "./year-chart";
import { SummaryTable } from "./summary-table";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import { formatCurrency } from "@/lib/formatters";
import type { IsIrInput, IsIrResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: IsIrInput;
  result: IsIrResult | null;
  loading: boolean;
  isValid: boolean;
}

export function IsIrResultsPanel({
  input,
  result,
  loading,
  isValid,
}: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>
          Renseignez le benefice annuel et la remuneration pour lancer la
          simulation.
        </p>
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

  const { optimalSplit, splitCurve } = result;

  const chartData = splitCurve.map((p) => ({
    salaire: p.salaireBrut,
    "Revenu net": p.revenuNet,
  }));

  return (
    <div className="space-y-6" id="results-panel">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Regime recommande"
          value={result.regimeRecommande === "IS" ? "Impot Societes" : "Impot Revenu"}
          subtitle="Sur 5 ans cumules"
          variant="success"
        />
        <ResultCard
          label="Cumul IS (5 ans)"
          value={formatCurrency(result.cumulIS)}
          subtitle="Revenu total dirigeant"
        />
        <ResultCard
          label="Cumul IR (5 ans)"
          value={formatCurrency(result.cumulIR)}
          subtitle="Revenu total dirigeant"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Badge className="bg-green-500 hover:bg-green-600">
          {result.regimeRecommande}
        </Badge>
        <p className="text-sm">
          Le regime{" "}
          <strong>
            {result.regimeRecommande === "IS"
              ? "Impot sur les Societes"
              : "Impot sur le Revenu"}
          </strong>{" "}
          vous fait economiser{" "}
          <strong>{formatCurrency(result.economie)}</strong> sur 5 ans.
        </p>
      </div>

      <YearChart result={result} />
      <SummaryTable result={result} />

      {/* Optimal split section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Repartition optimale salaire / dividendes (annee 1)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Salaire optimal</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(optimalSplit.salaireBrut)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Dividendes</p>
              <p className="text-lg font-bold">{formatCurrency(optimalSplit.dividendes)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Revenu net max</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(optimalSplit.revenuNet)}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="salaire" tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(v) => `Salaire: ${formatCurrency(Number(v))}`} contentStyle={{ fontSize: 12 }} />
              <ReferenceLine x={optimalSplit.salaireBrut} stroke="#16a34a" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="Revenu net" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell>Charges sociales</TableCell><TableCell className="text-right">{formatCurrency(optimalSplit.chargesSociales)}</TableCell></TableRow>
              <TableRow><TableCell>IR sur salaire</TableCell><TableCell className="text-right">{formatCurrency(optimalSplit.ir)}</TableCell></TableRow>
              <TableRow><TableCell>IS</TableCell><TableCell className="text-right">{formatCurrency(optimalSplit.is)}</TableCell></TableRow>
              <TableRow><TableCell>Flat tax (30%)</TableCell><TableCell className="text-right">{formatCurrency(optimalSplit.flatTax)}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton
          type="is_vs_ir"
          inputData={input}
          resultData={result}
        />
        <PdfExportButton
          data={{ type: "is_vs_ir", result }}
          reportTitle="Simulation IS vs IR — Projection 5 ans"
          filename="simulation-is-vs-ir-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
