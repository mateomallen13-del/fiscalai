import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span>Données fiscales 2025 intégrées</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Optimisez la rémunération{" "}
            <span className="text-blue-600">de vos dirigeants</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Simulez, comparez et conseillez en quelques clics. Générez des
            rapports PDF professionnels pour vos clients pendant le rendez-vous.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/inscription">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#fonctionnalites">Découvrir les fonctionnalités</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            3 simulations gratuites &middot; Sans engagement &middot; Sans carte
            bancaire
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Simulation instantanée</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Rapport PDF</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Données sécurisées</span>
          </div>
        </div>
      </div>
    </section>
  );
}
