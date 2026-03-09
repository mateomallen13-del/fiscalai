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
  LineChart,
  Line,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/formatters";
import type { IsIrResult } from "@/lib/fiscal/types";

interface YearChartProps {
  result: IsIrResult;
}

export function YearChart({ result }: YearChartProps) {
  const barData = result.annees.map((a) => ({
    name: `Année ${a.annee}`,
    "Revenu IS": a.is.revenuTotalDirigeant,
    "Revenu IR": a.ir.revenuApresIR,
  }));

  const lineData = result.annees.map((a) => ({
    name: `Année ${a.annee}`,
    Bénéfice: a.benefice,
    "IS total": a.is.montantIS,
    "Charges IS": a.is.chargesSociales,
    "IR total": a.ir.montantIR,
    "Charges IR": a.ir.chargesSociales,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Évolution sur 5 ans</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenus">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenus">Revenus</TabsTrigger>
            <TabsTrigger value="charges">Charges & impôts</TabsTrigger>
          </TabsList>
          <TabsContent value="revenus" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
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
                <Bar
                  dataKey="Revenu IS"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Revenu IR"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="charges" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
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
                <Line
                  type="monotone"
                  dataKey="IS total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Charges IS"
                  stroke="#93c5fd"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="IR total"
                  stroke="#f97316"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Charges IR"
                  stroke="#fdba74"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
