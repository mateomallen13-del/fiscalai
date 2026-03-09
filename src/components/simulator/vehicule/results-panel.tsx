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
import type { VehiculeInput, VehiculeResult } from "@/lib/fiscal/types";

interface ResultsPanelProps {
  input: VehiculeInput;
  result: VehiculeResult | null;
  loading: boolean;
  isValid: boolean;
}

export function VehiculeResultsPanel({ input, result, loading, isValid }: ResultsPanelProps) {
  if (!isValid) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
        <p>Renseignez le prix d&apos;achat et les kilometres pour lancer la simulation.</p>
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

  const { personnel, societe } = result;

  return (
    <div className="space-y-6" id="results-panel">
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Recommandation"
          value={result.recommandation === "societe" ? "Vehicule de societe" : "Vehicule personnel"}
          subtitle={`Economie de ${formatCurrency(result.economie)}`}
          variant="success"
        />
        <ResultCard
          label="Cout total entreprise (perso)"
          value={formatCurrency(personnel.coutTotalEntreprise)}
          subtitle={`${formatCurrency(personnel.coutAnnuelEntreprise)}/an`}
        />
        <ResultCard
          label="Cout total entreprise (societe)"
          value={formatCurrency(societe.coutTotalEntreprise)}
          subtitle={`${formatCurrency(societe.coutAnnuelEntreprise)}/an`}
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Badge className="bg-green-500 hover:bg-green-600">
          {result.recommandation === "societe" ? "Societe" : "Personnel"}
        </Badge>
        <p className="text-sm">
          Le <strong>{result.recommandation === "societe" ? "vehicule de societe" : "vehicule personnel"}</strong>{" "}
          est plus avantageux avec une economie de <strong>{formatCurrency(result.economie)}</strong>{" "}
          sur {input.dureeUtilisation} an{input.dureeUtilisation > 1 ? "s" : ""}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparaison detaillee</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%]">Poste</TableHead>
                <TableHead className="text-right">Personnel (IK)</TableHead>
                <TableHead className="text-right">Societe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Indemnites km / Amortissement</TableCell>
                <TableCell className="text-right">{formatCurrency(personnel.details.indemniteKm ?? 0)}/an</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.details.amortissementDeductible ?? 0)}/an</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Carburant</TableCell>
                <TableCell className="text-right">{formatCurrency(personnel.details.carburant)}/an</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.details.carburant)}/an</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Assurance + entretien</TableCell>
                <TableCell className="text-right text-muted-foreground">Inclus dans IK</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.details.assuranceEntretien ?? 0)}/an</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TVS annuelle</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.tvs)}/an</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TVA recuperee</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right text-green-600">-{formatCurrency(societe.tvaRecuperee)}/an</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Avantage en nature</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.avantageNature)}/an</TableCell>
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Cout annuel entreprise</TableCell>
                <TableCell className="text-right">{formatCurrency(personnel.coutAnnuelEntreprise)}</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.coutAnnuelEntreprise)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Cout total ({input.dureeUtilisation} ans)</TableCell>
                <TableCell className="text-right">{formatCurrency(personnel.coutTotalEntreprise)}</TableCell>
                <TableCell className="text-right">{formatCurrency(societe.coutTotalEntreprise)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 border-t pt-4">
        <SaveButton type="vehicule" inputData={input} resultData={result} />
        <PdfExportButton
          data={{ type: "vehicule", result }}
          reportTitle="Simulation Vehicule de Fonction"
          filename="simulation-vehicule-fiscalai.pdf"
        />
      </div>
    </div>
  );
}
