import {
  Calculator,
  GitCompareArrows,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Calculator,
    title: "Simulateur de rémunération",
    description:
      "Calculez le net perçu, les charges sociales et le coût total entreprise pour TNS et assimilé salarié.",
  },
  {
    icon: GitCompareArrows,
    title: "Comparateur de statuts",
    description:
      "Comparez EI, EURL, SASU et SAS avec les taux réels 2025. Trouvez le statut optimal en un clic.",
  },
  {
    icon: TrendingUp,
    title: "Simulation IS vs IR",
    description:
      "Projetez sur 3 ans avec prise en compte des dividendes, de la flat tax et des réserves.",
  },
  {
    icon: FileText,
    title: "Rapport PDF professionnel",
    description:
      "Générez un rapport clair avec graphiques, recommandations et branding de votre cabinet.",
  },
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-muted-foreground">
            Des outils pensés pour les experts-comptables, utilisables en
            rendez-vous client.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 bg-background shadow-sm">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
