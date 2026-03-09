import Link from "next/link";
import { Calculator, GitCompareArrows, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const simulators = [
  {
    href: "/simulateur/remuneration-dirigeant",
    title: "Rémunération dirigeant",
    description:
      "Comparez TNS vs Assimilé salarié. Charges sociales, IR, IS, dividendes.",
    icon: Calculator,
    available: true,
  },
  {
    href: "/simulateur/comparateur-statuts",
    title: "Comparateur de statuts juridiques",
    description: "Comparez EI, EURL, SASU et SAS automatiquement.",
    icon: GitCompareArrows,
    available: true,
  },
  {
    href: "/simulateur/is-vs-ir",
    title: "Simulation IS vs IR",
    description: "Simulation sur 3 ans avec dividendes et flat tax.",
    icon: TrendingUp,
    available: true,
  },
];

export default function SimulateurPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Simulateurs</h1>
      <p className="mt-1 text-muted-foreground">
        Choisissez un simulateur pour commencer.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulators.map((sim) => (
          <Link
            key={sim.title}
            href={sim.available ? sim.href : "#"}
            className={!sim.available ? "pointer-events-none" : ""}
          >
            <Card
              className={`h-full transition-shadow ${
                sim.available
                  ? "hover:shadow-md"
                  : "opacity-50"
              }`}
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <sim.icon className="h-5 w-5" />
                  </div>
                  {!sim.available && (
                    <Badge variant="secondary">Bientôt</Badge>
                  )}
                </div>
                <CardTitle className="text-base">{sim.title}</CardTitle>
                <CardDescription className="text-sm">
                  {sim.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
