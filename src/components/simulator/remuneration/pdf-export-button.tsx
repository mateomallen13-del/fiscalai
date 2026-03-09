"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdf/generate-report";
import { useBranding } from "@/hooks/use-branding";

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

  async function handleExport() {
    const element = document.getElementById("results-panel");
    if (!element) return;

    setLoading(true);
    try {
      await generatePDF(element, filename, {
        branding,
        clientName,
        reportTitle,
      });
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Télécharger PDF
    </Button>
  );
}
