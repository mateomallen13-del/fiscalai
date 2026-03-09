import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">
            Prêt à optimiser la fiscalité de vos clients ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Rejoignez les experts-comptables qui utilisent FiscalAI pour
            conseiller efficacement leurs clients.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link href="/inscription">
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
