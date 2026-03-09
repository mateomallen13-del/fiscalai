import type { BrandingConfig } from "@/hooks/use-branding";

interface PdfOptions {
  branding?: BrandingConfig;
  clientName?: string;
  reportTitle?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Generates a professional branded PDF from a DOM element.
 * Adds header with logo/cabinet name, and footer with disclaimer.
 */
export async function generatePDF(
  element: HTMLElement,
  filename: string = "simulation-fiscalai.pdf",
  options: PdfOptions = {}
) {
  // Dynamic imports
  const [html2canvasModule, jspdfModule] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jspdfModule;

  const { branding, clientName, reportTitle } = options;
  const accentColor = branding?.accentColor ?? "#2563eb";
  const [ar, ag, ab] = hexToRgb(accentColor);

  // Capture the element - simple and direct, no DOM mutation
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  if (imgWidth === 0 || imgHeight === 0) {
    throw new Error("Canvas has zero dimensions");
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pdfWidth - margin * 2;

  const headerHeight = 28;
  const footerHeight = 14;
  const contentTop = margin + headerHeight + 4;
  const usableHeight = pdfHeight - contentTop - footerHeight;

  const ratio = contentWidth / imgWidth;
  const pageContentHeightPx = usableHeight / ratio;

  let yPosition = 0;
  let pageNumber = 0;

  while (yPosition < imgHeight) {
    if (pageNumber > 0) pdf.addPage();
    pageNumber++;

    drawHeader(pdf, {
      pdfWidth,
      margin,
      accentColor: [ar, ag, ab],
      cabinetName: branding?.cabinetName,
      logoDataUrl: branding?.logoDataUrl ?? null,
      reportTitle: reportTitle ?? "Rapport de Simulation Fiscale",
      clientName,
      headerHeight,
    });

    const remainingHeight = imgHeight - yPosition;
    const sliceHeight = Math.min(pageContentHeightPx, remainingHeight);

    if (sliceHeight <= 0) break;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = imgWidth;
    pageCanvas.height = Math.ceil(sliceHeight);
    const ctx = pageCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        yPosition,
        imgWidth,
        sliceHeight,
        0,
        0,
        imgWidth,
        Math.ceil(sliceHeight)
      );
    }

    const pageImgData = pageCanvas.toDataURL("image/png");
    const pageScaledHeight = sliceHeight * ratio;

    pdf.addImage(
      pageImgData,
      "PNG",
      margin,
      contentTop,
      contentWidth,
      pageScaledHeight
    );

    drawFooter(pdf, {
      pdfWidth,
      pdfHeight,
      margin,
      accentColor: [ar, ag, ab],
      pageNumber,
      cabinetName: branding?.cabinetName,
    });

    yPosition += sliceHeight;
  }

  pdf.save(filename);
}

function drawHeader(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  opts: {
    pdfWidth: number;
    margin: number;
    accentColor: [number, number, number];
    cabinetName?: string;
    logoDataUrl: string | null;
    reportTitle: string;
    clientName?: string;
    headerHeight: number;
  }
) {
  const {
    pdfWidth,
    margin,
    accentColor,
    cabinetName,
    logoDataUrl,
    reportTitle,
    clientName,
    headerHeight,
  } = opts;
  const [ar, ag, ab] = accentColor;

  // Accent line at top
  pdf.setFillColor(ar, ag, ab);
  pdf.rect(0, 0, pdfWidth, 3, "F");

  let leftX = margin;

  // Logo
  if (logoDataUrl) {
    try {
      pdf.addImage(logoDataUrl, "PNG", margin, 6, 16, 16);
      leftX = margin + 20;
    } catch {
      // If logo fails to load, skip it
    }
  }

  // Cabinet name
  if (cabinetName) {
    pdf.setFontSize(14);
    pdf.setTextColor(ar, ag, ab);
    pdf.setFont("helvetica", "bold");
    pdf.text(cabinetName, leftX, 14);
  }

  // Report title
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont("helvetica", "normal");
  pdf.text(reportTitle, leftX, cabinetName ? 20 : 14);

  // Client name
  if (clientName) {
    pdf.setFontSize(9);
    pdf.text(`Client : ${clientName}`, leftX, cabinetName ? 25 : 19);
  }

  // Date on the right
  pdf.setFontSize(9);
  pdf.setTextColor(130, 130, 130);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dateWidth = pdf.getTextWidth(dateStr);
  pdf.text(dateStr, pdfWidth - margin - dateWidth, 12);

  pdf.setFontSize(8);
  const fiscalLabel = "Données fiscales 2025";
  const fiscalWidth = pdf.getTextWidth(fiscalLabel);
  pdf.text(fiscalLabel, pdfWidth - margin - fiscalWidth, 17);

  // Separator line
  pdf.setDrawColor(ar, ag, ab);
  pdf.setLineWidth(0.5);
  pdf.line(
    margin,
    margin + headerHeight - 2,
    pdfWidth - margin,
    margin + headerHeight - 2
  );
}

function drawFooter(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  opts: {
    pdfWidth: number;
    pdfHeight: number;
    margin: number;
    accentColor: [number, number, number];
    pageNumber: number;
    cabinetName?: string;
  }
) {
  const { pdfWidth, pdfHeight, margin, accentColor, pageNumber, cabinetName } =
    opts;
  const [ar, ag, ab] = accentColor;
  const footerY = pdfHeight - 10;

  // Separator
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 4, pdfWidth - margin, footerY - 4);

  // Disclaimer
  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Ce document est une simulation à titre indicatif et ne constitue pas un conseil fiscal. Consultez votre expert-comptable.",
    margin,
    footerY
  );

  // Branding + page
  const brandText = cabinetName
    ? `${cabinetName} — Généré par FiscalAI`
    : "Généré par FiscalAI";
  pdf.setTextColor(ar, ag, ab);
  pdf.setFontSize(7);
  const rightText = `${brandText}  |  Page ${pageNumber}`;
  const rightWidth = pdf.getTextWidth(rightText);
  pdf.text(rightText, pdfWidth - margin - rightWidth, footerY);
}
