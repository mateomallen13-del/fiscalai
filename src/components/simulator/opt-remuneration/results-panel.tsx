"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResultCard } from "@/components/simulator/shared/result-card";
import { PdfExportButton } from "@/components/simulator/remuneration/pdf-export-button";
import { SaveButton } from "@/components/simulator/shared/save-button";
import { formatCurrency } from "@/lib/formatters";
import type { OptRemunerationInput, OptRemunerationResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: OptRemunerationInput;
  result: OptRemunerationResult | null;
  loading: boolean;
  isValid: boolean;
}

export function OptRemunerationResultsPanel({ input, result, loading, isValid }: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>Renseignez le benefice de la societe pour lancer la simulation.</p>
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

  const { optimal, toutSalaire, toutDividendes, courbe } = result;

  const chartData = courbe.map((p) => ({
    salaire: p.salaireBrut,
    "Revenu net": p.revenuNetTotal,
    "Salaire net": p.salaireNet - p.ir,
    "Dividendes nets": p.dividendesNets,
  }));

  return (
    <div className="space-y-6" id="results-panel">
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Salaire optimal"
          value={formatCurrency(optimal.salaireBrut)}
          subtitle={`Net: ${formatCurrency(optimal.salaireNet - optimal.ir)}`}
          variant="success"
        />
        <ResultCard
          label="Dividendes optimaux"
          value={formatCurrency(optimal.dividendesBruts)}
          subtitle={`Net: ${formatCurrency(optimal.dividendesNets)}`}
        />
        <ResultCard
          label="Revenu net total optimal"
          value={formatCurrency(optimal.revenuNetTotal)}
          subtitle={`vs tout salaire: +${formatCurrency(result.economieVsToutSalaire)}`}
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Badge className="bg-green-500 hover:bg-green-600">Optimal</Badge>
        <p className="text-sm">
          Salaire brut de <strong>{formatCurrency(optimal.salaireBrut)}</strong> + dividendes
          de <strong>{formatCurrency(optimal.dividendesBruts)}</strong> maximise votre revenu net
          a <strong>{formatCurrency(optimal.revenuNetTotal)}</strong>.
        </p>
      </div>

      {/* Optimization curve */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Courbe d&apos;optimisation salaire / dividendes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="salaire"
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                tick={{ fontSize: 11 }}
                label={{ value: "Salaire brut", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(v) => `Salaire: ${formatCurrency(Number(v))}`}
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine x={optimal.salaireBrut} stroke="#16a34a" strokeDasharray="5 5" label={{ value: "Optimal", fill: "#16a34a", fontSize: 11 }} />
              <Area type="monotone" dataKey="Revenu net" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="Salaire net" stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={1.5} />
              <Area type="monotone" dataKey="Dividendes nets" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparaison des strategies</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Poste</TableHead>
                <TableHead className="text-right">100% Salaire</TableHead>
                <TableHead className="text-right text-green-700">Optimal</TableHead>
                <TableHead className="text-right">100% Dividendes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Salaire brut</TableCell>
                <TableCell className="text-right">{formatCurrency(toutSalaire.salaireBrut)}</TableCell>
                <TableCell className="text-right text-green-700 font-medium">{formatCurrency(optimal.salaireBrut)}</TableCell>
                <TableCell className="text-right">{formatCurrency(toutDividendes.salaireBrut)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Charges sociales</TableCell>
                <TableCell className="text-right">{formatCurrency(toutSalaire.chargesSociales)}</TableCell>
                <TableCell className="text-right text-green-700">{formatCurrency(optimal.chargesSociales)}</TableCell>
                <TableCell className="text-right">{formatCurrency(toutDividendes.chargesSociales)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IR</TableCell>
                <TableCell className="text-right">{formatCurrency(toutSalaire.ir)}</TableCell>
                <TableCell className="text-right text-green-700">{formatCurrency(optimal.ir)}</TableCell>
                <TableCell className="text-right">{formatCurrency(toutDividendes.ir)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">IS</TableCell>
                <TableCell className="text-right">{formatCurrency(toutSalaire.is)}</TableCell>
                <TableCell className="text-right text-green-700">{formatCurrency(optimal.is)}</TableCell>
                <TableCell className="text-right">{formatCurrency(toutDividendes.is)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividendes nets</TableCell>
                <TableCell className="text-right">{formatCurrency(toutSalaire.dividendesNets)}</TableCell>
                <TableCell className="text-right text-green-700">{formatCurrency(optimal.dividendesNets)}</TableCell>
                <TableCell className="text-right">{formatCurrency(toutDividendes.dividendesNets)}</TableCell>
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Revenu net total</TableCell>
                <TableCell className="text-right">{formatCurrency(toutSalaire.revenuNetTotal)}</TableCell>
                <TableCell className="text-right text-green-700">{formatCurrency(optimal.revenuNetTotal)}</TableCell>
                <TableCell className="text-right">{formatCurrency(toutDividendes.revenuNetTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton type="opt_remuneration" inputData={input} resultData={result} />
        <PdfExportButton data={{ type: "opt_remuneration", result }} reportTitle="Optimisation Remuneration — Salaire vs Dividendes" filename="optimisation-remuneration-fiscalai.pdf" />
      </div>
    </div>
  );
}
