import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { SimulationResult } from "@/lib/fiscal/types";

interface ComparisonTableProps {
  result: SimulationResult;
}

export function ComparisonTable({ result }: ComparisonTableProps) {
  const { tns, sasu } = result;

  const rows = [
    {
      label: "Rémunération brute",
      tns: formatCurrency(tns.remunerationBrute),
      sasu: formatCurrency(sasu.remunerationBrute),
    },
    {
      label: "Charges sociales totales",
      tns: formatCurrency(tns.chargesSociales),
      sasu: formatCurrency(sasu.chargesSociales),
    },
    {
      label: "Net avant IR",
      tns: formatCurrency(tns.netAvantIR),
      sasu: formatCurrency(sasu.netAvantIR),
    },
    {
      label: "Impôt sur le revenu",
      tns: formatCurrency(tns.ir.impotNet),
      sasu: formatCurrency(sasu.ir.impotNet),
    },
    {
      label: "Taux marginal IR",
      tns: formatPercent(tns.ir.tauxMarginal),
      sasu: formatPercent(sasu.ir.tauxMarginal),
    },
    {
      label: "Net après IR",
      tns: formatCurrency(tns.netApresIR),
      sasu: formatCurrency(sasu.netApresIR),
      bold: true,
    },
    {
      label: "Coût total entreprise",
      tns: formatCurrency(tns.coutTotalEntreprise),
      sasu: formatCurrency(sasu.coutTotalEntreprise),
    },
    {
      label: "Bénéfice résiduel (avant IS)",
      tns: formatCurrency(tns.beneficeResiduel),
      sasu: formatCurrency(sasu.beneficeResiduel),
    },
    {
      label: "IS",
      tns: formatCurrency(tns.is.montant),
      sasu: formatCurrency(sasu.is.montant),
    },
    {
      label: "Dividendes bruts possibles",
      tns: formatCurrency(tns.dividendes.montantBrut),
      sasu: formatCurrency(sasu.dividendes.montantBrut),
    },
    {
      label: "Flat tax (30%)",
      tns: formatCurrency(tns.dividendes.flatTax),
      sasu: formatCurrency(sasu.dividendes.flatTax),
    },
    {
      label: "Dividendes nets",
      tns: formatCurrency(tns.dividendes.montantNet),
      sasu: formatCurrency(sasu.dividendes.montantNet),
    },
    {
      label: "Revenu total dirigeant",
      tns: formatCurrency(tns.revenuTotalDirigeant),
      sasu: formatCurrency(sasu.revenuTotalDirigeant),
      bold: true,
      highlight: true,
    },
  ];

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]">Poste</TableHead>
            <TableHead className="text-right">TNS (EURL)</TableHead>
            <TableHead className="text-right">SASU</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
              className={row.highlight ? "bg-muted/50" : ""}
            >
              <TableCell
                className={row.bold ? "font-semibold" : "text-muted-foreground"}
              >
                {row.label}
              </TableCell>
              <TableCell
                className={`text-right ${row.bold ? "font-semibold" : ""}`}
              >
                {row.tns}
              </TableCell>
              <TableCell
                className={`text-right ${row.bold ? "font-semibold" : ""}`}
              >
                {row.sasu}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
