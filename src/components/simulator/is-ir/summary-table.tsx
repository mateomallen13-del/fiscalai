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
import { formatCurrency } from "@/lib/formatters";
import type { IsIrResult } from "@/lib/fiscal/types";

interface SummaryTableProps {
  result: IsIrResult;
}

export function SummaryTable({ result }: SummaryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Détail année par année</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Indicateur</TableHead>
              {result.annees.map((a) => (
                <TableHead key={a.annee} colSpan={2} className="text-center">
                  Année {a.annee}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              <TableHead />
              {result.annees.map((a) => (
                <TableHead key={a.annee} colSpan={1} className="text-center text-xs">
                  <div className="flex gap-2 justify-center">
                    <span className="text-blue-600">IS</span>
                    <span className="text-orange-600">IR</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Bénéfice</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center">
                  {formatCurrency(a.benefice)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Charges sociales</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center text-xs">
                  <div className="flex gap-3 justify-center">
                    <span className="text-blue-600">
                      {formatCurrency(a.is.chargesSociales)}
                    </span>
                    <span className="text-orange-600">
                      {formatCurrency(a.ir.chargesSociales)}
                    </span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Impôts</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center text-xs">
                  <div className="flex gap-3 justify-center">
                    <span className="text-blue-600">
                      {formatCurrency(a.is.montantIS + a.is.irSurRemuneration + a.is.flatTax)}
                    </span>
                    <span className="text-orange-600">
                      {formatCurrency(a.ir.montantIR)}
                    </span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Dividendes nets</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center text-xs">
                  <div className="flex gap-3 justify-center">
                    <span className="text-blue-600">
                      {formatCurrency(a.is.dividendesNets)}
                    </span>
                    <span className="text-orange-600">—</span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Réserves</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center text-xs">
                  <div className="flex gap-3 justify-center">
                    <span className="text-blue-600">
                      {formatCurrency(a.is.reserves)}
                    </span>
                    <span className="text-orange-600">—</span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="font-bold bg-muted/50">
              <TableCell>Revenu total dirigeant</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center text-xs">
                  <div className="flex gap-3 justify-center">
                    <span className="text-blue-600">
                      {formatCurrency(a.is.revenuTotalDirigeant)}
                    </span>
                    <span className="text-orange-600">
                      {formatCurrency(a.ir.revenuApresIR)}
                    </span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Avantage IS</TableCell>
              {result.annees.map((a) => (
                <TableCell key={a.annee} className="text-center">
                  <span
                    className={
                      a.avantageIS >= 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"
                    }
                  >
                    {a.avantageIS >= 0 ? "+" : ""}
                    {formatCurrency(a.avantageIS)}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
