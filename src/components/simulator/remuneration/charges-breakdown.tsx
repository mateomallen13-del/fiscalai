import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import type { SimulationResult, ChargesDetailTNS } from "@/lib/fiscal/types";

interface ChargesBreakdownProps {
  result: SimulationResult;
}

export function ChargesBreakdown({ result }: ChargesBreakdownProps) {
  const tnsCharges = result.tns.chargesDetail as ChargesDetailTNS;
  const sasuCharges = result.sasu.chargesDetail as {
    salariales: number;
    patronales: number;
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-semibold">
          Détail charges TNS (Gérant majoritaire EURL)
        </h4>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cotisation</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Maladie-maternité
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.maladieMaterinte)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Indemnités journalières
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.indemniteJournalieres)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Retraite de base
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.retraiteBase)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Retraite complémentaire
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.retraiteComplementaire)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Invalidité-décès
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.invaliditeDeces)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Allocations familiales
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.allocationsFamiliales)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  CSG/CRDS
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.csgCrds)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Formation professionnelle
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tnsCharges.formationPro)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(tnsCharges.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold">
          Détail charges SASU (Président assimilé salarié)
        </h4>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cotisation</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Charges salariales (~22%)
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sasuCharges.salariales)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Charges patronales (~42%)
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sasuCharges.patronales)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(
                    sasuCharges.salariales + sasuCharges.patronales
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
