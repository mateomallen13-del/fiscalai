import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const plans = [
  {
    name: "Découverte",
    price: "0 €",
    period: "",
    description: "Pour tester l'outil sans engagement",
    features: [
      "3 simulations gratuites",
      "Simulateur de rémunération",
      "Comparaison TNS vs Salarié",
      "Export PDF basique",
    ],
    cta: "Commencer gratuitement",
    href: "/inscription",
    highlighted: false,
  },
  {
    name: "Professionnel",
    price: "49 €",
    period: "/mois",
    description: "Pour les cabinets d'expertise comptable",
    features: [
      "Simulations illimitées",
      "Tous les simulateurs",
      "Comparateur de statuts juridiques",
      "Simulation IS vs IR sur 3 ans",
      "Rapport PDF personnalisé",
      "Logo et couleurs du cabinet",
      "Historique des simulations",
      "Support prioritaire",
    ],
    cta: "Démarrer l'essai gratuit",
    href: "/inscription",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="tarifs" className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Tarifs simples et transparents
          </h2>
          <p className="mt-4 text-muted-foreground">
            Commencez gratuitement, passez au plan Pro quand vous êtes prêt.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.highlighted
                  ? "border-blue-600 shadow-lg ring-1 ring-blue-600"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="rounded-t-lg bg-blue-600 px-4 py-1.5 text-center text-xs font-medium text-white">
                  Recommandé
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
