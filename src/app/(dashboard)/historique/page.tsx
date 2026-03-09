"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Calculator,
  GitCompareArrows,
  TrendingUp,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";

interface Simulation {
  id: string;
  type: string;
  client_name: string | null;
  input_data: Record<string, unknown>;
  result_data: Record<string, unknown>;
  created_at: string;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof Calculator; href: string; badge: string }
> = {
  remuneration_dirigeant: {
    label: "Rémunération dirigeant",
    icon: Calculator,
    href: "/simulateur/remuneration-dirigeant",
    badge: "Rémunération",
  },
  comparateur_statuts: {
    label: "Comparateur de statuts",
    icon: GitCompareArrows,
    href: "/simulateur/comparateur-statuts",
    badge: "Statuts",
  },
  is_vs_ir: {
    label: "IS vs IR",
    icon: TrendingUp,
    href: "/simulateur/is-vs-ir",
    badge: "IS/IR",
  },
};

function getResultSummary(sim: Simulation): string {
  const result = sim.result_data;
  if (!result) return "—";

  if (sim.type === "remuneration_dirigeant") {
    const r = result as { regimeRecommande?: string; economie?: number };
    if (r.regimeRecommande) {
      return `${r.regimeRecommande} recommandé — économie ${formatCurrency(r.economie ?? 0)}`;
    }
  }

  if (sim.type === "comparateur_statuts") {
    const r = result as { recommandation?: { statut?: string } };
    if (r.recommandation?.statut) {
      return `${r.recommandation.statut} recommandé`;
    }
  }

  if (sim.type === "is_vs_ir") {
    const r = result as {
      regimeRecommande?: string;
      economie?: number;
    };
    if (r.regimeRecommande) {
      return `${r.regimeRecommande} recommandé — économie ${formatCurrency(r.economie ?? 0)} sur 3 ans`;
    }
  }

  return "—";
}

export default function HistoriquePage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSimulations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("type", filter);
      const res = await fetch(`/api/simulation/list?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSimulations(data.simulations ?? []);
      }
    } catch {
      toast.error("Erreur lors du chargement de l'historique.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/simulation/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });
      if (res.ok) {
        setSimulations((prev) => prev.filter((s) => s.id !== deleteId));
        toast.success("Simulation supprimée.");
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    } catch {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const filtered = simulations.filter((sim) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      sim.client_name?.toLowerCase().includes(q) ||
      TYPE_CONFIG[sim.type]?.label.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Historique</h1>
      <p className="mt-1 text-muted-foreground">
        Retrouvez toutes vos simulations sauvegardées.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="remuneration_dirigeant">
              Rémunération dirigeant
            </SelectItem>
            <SelectItem value="comparateur_statuts">
              Comparateur de statuts
            </SelectItem>
            <SelectItem value="is_vs_ir">IS vs IR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex h-48 items-center justify-center text-center text-muted-foreground">
              {simulations.length === 0
                ? "Aucune simulation sauvegardée pour le moment. Lancez un simulateur et sauvegardez vos résultats."
                : "Aucune simulation ne correspond à votre recherche."}
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Résultat
                  </TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sim) => {
                  const config = TYPE_CONFIG[sim.type];
                  const Icon = config?.icon ?? Calculator;
                  return (
                    <TableRow key={sim.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sim.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-blue-600" />
                          <Badge variant="secondary" className="text-xs">
                            {config?.badge ?? sim.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {sim.client_name || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {getResultSummary(sim)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={config?.href ?? "/simulateur"}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => setDeleteId(sim.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la simulation</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. La simulation sera définitivement
              supprimée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
