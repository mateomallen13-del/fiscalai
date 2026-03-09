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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { StatutsResult } from "@/lib/fiscal/types";

interface ComparisonChartProps {
  result: StatutsResult;
}

export function StatutsComparisonChart({ result }: ComparisonChartProps) {
  const data = result.statuts.map((s) => ({
    name: s.label,
    "Net disponible": s.netDisponible,
    "Charges sociales": s.chargesSociales,
    "Coût entreprise": s.coutTotalEntreprise,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparaison visuelle</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="Net disponible" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Charges sociales" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Coût entreprise" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
