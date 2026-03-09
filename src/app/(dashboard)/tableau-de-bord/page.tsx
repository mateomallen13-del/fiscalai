"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  GitCompareArrows,
  TrendingUp,
  BarChart3,
  Clock,
  FileText,
  ArrowRight,
  Building2,
  Car,
  Network,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";

const simulators = [
  {
    href: "/simulateur/remuneration-dirigeant",
    title: "Rémunération dirigeant",
    description: "Comparez TNS vs Assimilé salarié",
    icon: Calculator,
  },
  {
    href: "/simulateur/comparateur-statuts",
    title: "Comparateur de statuts",
    description: "EI, EURL, SASU, SAS",
    icon: GitCompareArrows,
  },
  {
    href: "/simulateur/is-vs-ir",
    title: "IS vs IR",
    description: "Simulation sur 3 ans",
    icon: TrendingUp,
  },
  {
    href: "/simulateur/sci",
    title: "Simulateur SCI",
    description: "SCI IR vs SCI IS",
    icon: Building2,
  },
  {
    href: "/simulateur/vehicule-fonction",
    title: "Véhicule de fonction",
    description: "Personnel vs société, TVS",
    icon: Car,
  },
  {
    href: "/simulateur/fiscalite-holding",
    title: "Fiscalité holding",
    description: "Régime mère-fille",
    icon: Network,
  },
];

const TYPE_LABELS: Record<string, string> = {
  remuneration_dirigeant: "Rémunération",
  comparateur_statuts: "Statuts",
  is_vs_ir: "IS/IR",
  sci: "SCI",
  vehicule: "Véhicule",
  holding: "Holding",
};

interface Stats {
  total: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
  subscriptionStatus: string;
  simulationCount: number;
}

interface RecentSim {
  id: string;
  type: string;
  client_name: string | null;
  result_data: Record<string, unknown>;
  created_at: string;
}

function getResultLabel(sim: RecentSim): string {
  const r = sim.result_data;
  if (!r) return "";
  if (sim.type === "remuneration_dirigeant") {
    const d = r as { regimeRecommande?: string; economie?: number };
    return d.regimeRecommande
      ? `${d.regimeRecommande} — ${formatCurrency(d.economie ?? 0)} d'économie`
      : "";
  }
  if (sim.type === "comparateur_statuts") {
    const d = r as { recommandation?: { statut?: string } };
    return d.recommandation?.statut ? `${d.recommandation.statut} recommandé` : "";
  }
  if (sim.type === "is_vs_ir") {
    const d = r as { regimeRecommande?: string; economie?: number };
    return d.regimeRecommande
      ? `${d.regimeRecommande} — ${formatCurrency(d.economie ?? 0)} sur 3 ans`
      : "";
  }
  if (sim.type === "sci") {
    const d = r as { regimeRecommande?: string; economie?: number };
    return d.regimeRecommande
      ? `SCI ${d.regimeRecommande} — ${formatCurrency(d.economie ?? 0)} sur 3 ans`
      : "";
  }
  if (sim.type === "vehicule") {
    const d = r as { recommandation?: string; economie?: number };
    return d.recommandation
      ? `${d.recommandation === "societe" ? "Société" : "Personnel"} — ${formatCurrency(d.economie ?? 0)}`
      : "";
  }
  if (sim.type === "holding") {
    const d = r as { recommandation?: string; economie?: number };
    return d.recommandation
      ? `${d.recommandation === "avec_holding" ? "Holding" : "Direct"} — ${formatCurrency(d.economie ?? 0)}`
      : "";
  }
  return "";
}

export default function TableauDeBordPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentSim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, listRes] = await Promise.all([
          fetch("/api/simulation/stats"),
          fetch("/api/simulation/list?limit=5"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (listRes.ok) {
          const data = await listRes.json();
          setRecent(data.simulations ?? []);
        }
      } catch {
        // silently fail — dashboard still usable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-muted-foreground">
        Bienvenue sur FiscalAI. Lancez une simulation pour commencer.
      </p>

      {/* Stats cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <StatCard
              icon={FileText}
              label="Simulations totales"
              value={stats?.total?.toString() ?? "0"}
            />
            <StatCard
              icon={Calculator}
              label="Rémunération"
              value={stats?.byType?.remuneration_dirigeant?.toString() ?? "0"}
            />
            <StatCard
              icon={GitCompareArrows}
              label="Comparateur statuts"
              value={stats?.byType?.comparateur_statuts?.toString() ?? "0"}
            />
            <StatCard
              icon={TrendingUp}
              label="IS vs IR"
              value={stats?.byType?.is_vs_ir?.toString() ?? "0"}
            />
          </>
        )}
      </div>

      {/* Subscription status */}
      {!loading && stats && (
        <div className="mt-4">
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {stats.subscriptionStatus === "active"
                      ? "Plan Professionnel"
                      : "Plan Découverte"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.subscriptionStatus === "active"
                      ? "Simulations illimitées"
                      : `${stats.simulationCount}/3 simulations utilisées`}
                  </p>
                </div>
              </div>
              {stats.subscriptionStatus !== "active" && (
                <Link href="/parametres">
                  <Button size="sm" variant="outline">
                    Passer au Pro
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Simulators */}
      <h2 className="mt-8 text-lg font-semibold">Simulateurs</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulators.map((sim) => (
          <Link key={sim.title} href={sim.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <sim.icon className="h-5 w-5" />
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

      {/* Recent simulations */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Simulations récentes</h2>
        {recent.length > 0 && (
          <Link href="/historique">
            <Button variant="ghost" size="sm" className="text-xs">
              Voir tout
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : recent.length === 0 ? (
          <Card>
            <CardContent className="flex h-32 items-center justify-center text-center text-sm text-muted-foreground">
              Aucune simulation sauvegardée. Lancez un simulateur et
              sauvegardez vos résultats pour les retrouver ici.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recent.map((sim) => (
              <Card key={sim.id}>
                <CardContent className="flex items-center gap-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {TYPE_LABELS[sim.type] ?? sim.type}
                      </Badge>
                      {sim.client_name && (
                        <span className="truncate text-sm font-medium">
                          {sim.client_name}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {getResultLabel(sim)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(sim.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
