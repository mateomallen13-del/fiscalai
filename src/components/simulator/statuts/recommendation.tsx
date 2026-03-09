import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import type { StatutsResult } from "@/lib/fiscal/types";

interface RecommendationProps {
  result: StatutsResult;
}

export function Recommendation({ result }: RecommendationProps) {
  const { recommandation } = result;
  const bestStatut = result.statuts.find(
    (s) => s.statut === recommandation.statut
  );

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="flex gap-4 pt-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold">Recommandation</p>
            <Badge className="bg-green-500 hover:bg-green-600">
              {bestStatut?.label}
            </Badge>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {recommandation.raisons.map((raison, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-500">•</span>
                {raison}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
