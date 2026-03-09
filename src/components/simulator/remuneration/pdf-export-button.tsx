"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdf/generate-report";
import { useBranding } from "@/hooks/use-branding";
import { toast } from "sonner";

interface PdfExportButtonProps {
  filename?: string;
  reportTitle?: string;
  clientName?: string;
}

export function PdfExportButton({
  filename = "simulation-fiscalai.pdf",
  reportTitle,
  clientName,
}: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const { branding } = useBranding();

  async function handleExport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const element = document.getElementById("results-panel");
    if (!element) {
      toast.error("Aucun résultat à exporter.");
      return;
    }

    setLoading(true);
    try {
      await generatePDF(element, filename, {
        branding,
        clientName,
        reportTitle,
      });
      toast.success("PDF téléchargé.");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error("Erreur lors de la génération du PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Télécharger PDF
    </Button>
  );
}
