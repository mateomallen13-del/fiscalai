"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDF, type PdfData } from "@/lib/pdf/generate-report";
import { useBranding } from "@/hooks/use-branding";
import { toast } from "sonner";

interface PdfExportButtonProps {
  data: PdfData;
  filename?: string;
  reportTitle?: string;
  clientName?: string;
}

export function PdfExportButton({
  data,
  filename = "simulation-fiscalai.pdf",
  reportTitle,
  clientName,
}: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const { branding } = useBranding();

  async function handleExport(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      await generatePDF(data, filename, {
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
