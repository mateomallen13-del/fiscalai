"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";
import type { SimulationResult } from "@/lib/fiscal/types";

interface ChartComparisonProps {
  result: SimulationResult;
}

export function ChartComparison({ result }: ChartComparisonProps) {
  const { tns, sasu } = result;

  const comparisonData = [
    {
      name: "Charges sociales",
      TNS: tns.chargesSociales,
      SASU: sasu.chargesSociales,
    },
    {
      name: "Net après IR",
      TNS: tns.netApresIR,
      SASU: sasu.netApresIR,
    },
    {
      name: "Coût entreprise",
      TNS: tns.coutTotalEntreprise,
      SASU: sasu.coutTotalEntreprise,
    },
    {
      name: "Dividendes nets",
      TNS: tns.dividendes.montantNet,
      SASU: sasu.dividendes.montantNet,
    },
    {
      name: "Revenu total",
      TNS: tns.revenuTotalDirigeant,
      SASU: sasu.revenuTotalDirigeant,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 font-semibold">Comparaison TNS vs SASU</h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={(v) =>
                  `${Math.round(v / 1000)}k €`
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend />
              <Bar
                dataKey="TNS"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                name="TNS (EURL)"
              />
              <Bar
                dataKey="SASU"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
                name="SASU"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
