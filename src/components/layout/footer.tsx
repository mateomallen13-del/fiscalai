import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Simulateur fiscal pour experts-comptables.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/mentions-legales" className="hover:text-foreground">
              Mentions légales
            </a>
            <a href="mailto:contact@fiscalai.fr" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FiscalAI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
