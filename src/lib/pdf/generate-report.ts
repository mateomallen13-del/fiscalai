import type { BrandingConfig } from "@/hooks/use-branding";
import type {
  SimulationResult,
  IsIrResult,
  StatutsResult,
} from "@/lib/fiscal/types";

// ── Types ──────────────────────────────────────────────────────────────

export type PdfData =
  | { type: "remuneration"; result: SimulationResult }
  | { type: "is_vs_ir"; result: IsIrResult }
  | { type: "comparateur_statuts"; result: StatutsResult };

interface PdfOptions {
  branding?: BrandingConfig;
  clientName?: string;
  reportTitle?: string;
}

type JsPDFInstance = InstanceType<typeof import("jspdf").jsPDF>;

// ── Helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function fmtCurrency(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

function fmtPercent(n: number): string {
  return (n * 100).toFixed(1).replace(".", ",") + " %";
}

// ── Table drawing helpers ──────────────────────────────────────────────

interface TableColumn {
  label: string;
  width: number;
  align?: "left" | "right" | "center";
}

interface TableRow {
  cells: string[];
  bold?: boolean;
  highlight?: boolean;
}

function drawTable(
  pdf: JsPDFInstance,
  startY: number,
  columns: TableColumn[],
  rows: TableRow[],
  accent: [number, number, number],
  margin: number,
  pdfWidth: number,
  pdfHeight: number
): number {
  const rowHeight = 7;
  const headerHeight = 8;
  const [ar, ag, ab] = accent;
  let y = startY;

  // Check page break
  const checkPage = () => {
    if (y + rowHeight > pdfHeight - 20) {
      pdf.addPage();
      y = 20;
    }
  };

  // Header background
  pdf.setFillColor(ar, ag, ab);
  pdf.rect(margin, y, pdfWidth - margin * 2, headerHeight, "F");
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");

  let x = margin + 2;
  for (const col of columns) {
    const textX =
      col.align === "right"
        ? x + col.width - 3
        : col.align === "center"
          ? x + col.width / 2
          : x + 1;
    pdf.text(col.label, textX, y + 5.5, {
      align: col.align ?? "left",
    });
    x += col.width;
  }
  y += headerHeight;

  // Rows
  pdf.setFontSize(8);
  for (let i = 0; i < rows.length; i++) {
    checkPage();
    const row = rows[i];

    // Alternating background
    if (row.highlight) {
      pdf.setFillColor(ar, ag, ab);
      pdf.rect(margin, y, pdfWidth - margin * 2, rowHeight, "F");
    } else if (i % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, y, pdfWidth - margin * 2, rowHeight, "F");
    }

    pdf.setFont("helvetica", row.bold || row.highlight ? "bold" : "normal");
    pdf.setTextColor(row.highlight ? 255 : 50, row.highlight ? 255 : 50, row.highlight ? 255 : 50);

    x = margin + 2;
    for (let c = 0; c < columns.length; c++) {
      const col = columns[c];
      const text = row.cells[c] ?? "";
      const textX =
        col.align === "right"
          ? x + col.width - 3
          : col.align === "center"
            ? x + col.width / 2
            : x + 1;
      pdf.text(text, textX, y + 5, { align: col.align ?? "left" });
      x += col.width;
    }
    y += rowHeight;
  }

  return y;
}

// ── Section title helper ───────────────────────────────────────────────

function drawSectionTitle(
  pdf: JsPDFInstance,
  title: string,
  y: number,
  accent: [number, number, number],
  margin: number
): number {
  const [ar, ag, ab] = accent;
  pdf.setFontSize(12);
  pdf.setTextColor(ar, ag, ab);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, margin, y);
  pdf.setDrawColor(ar, ag, ab);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y + 2, margin + pdf.getTextWidth(title), y + 2);
  return y + 8;
}

// ── Metric card helper ─────────────────────────────────────────────────

function drawMetricCard(
  pdf: JsPDFInstance,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  accent: [number, number, number]
): number {
  const [ar, ag, ab] = accent;
  const height = 18;

  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(x, y, width, height, 2, 2, "S");

  // Accent left border
  pdf.setFillColor(ar, ag, ab);
  pdf.rect(x, y + 2, 1.5, height - 4, "F");

  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  pdf.setFont("helvetica", "normal");
  pdf.text(label, x + 5, y + 6);

  pdf.setFontSize(13);
  pdf.setTextColor(30, 30, 30);
  pdf.setFont("helvetica", "bold");
  pdf.text(value, x + 5, y + 14);

  return y + height + 4;
}

// ── Bar chart helper ───────────────────────────────────────────────────

function drawBarChart(
  pdf: JsPDFInstance,
  startY: number,
  items: { label: string; values: { value: number; color: [number, number, number]; legend: string }[] }[],
  margin: number,
  pdfWidth: number,
  pdfHeight: number
): number {
  const chartWidth = pdfWidth - margin * 2;
  const chartHeight = 40;
  let y = startY;

  if (y + chartHeight + 15 > pdfHeight - 20) {
    pdf.addPage();
    y = 20;
  }

  const maxVal = Math.max(...items.flatMap((i) => i.values.map((v) => Math.abs(v.value))), 1);
  const barGroupWidth = chartWidth / items.length;
  const barWidth = Math.min(12, (barGroupWidth - 8) / items[0].values.length);

  // Legend
  const legends = items[0].values.map((v) => v.legend);
  const colors = items[0].values.map((v) => v.color);
  let legendX = margin;
  pdf.setFontSize(7);
  for (let i = 0; i < legends.length; i++) {
    pdf.setFillColor(...colors[i]);
    pdf.rect(legendX, y, 4, 3, "F");
    pdf.setTextColor(80, 80, 80);
    pdf.text(legends[i], legendX + 5, y + 2.5);
    legendX += pdf.getTextWidth(legends[i]) + 10;
  }
  y += 6;

  const baselineY = y + chartHeight;

  // Baseline
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.2);
  pdf.line(margin, baselineY, margin + chartWidth, baselineY);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const groupX = margin + i * barGroupWidth + barGroupWidth / 2 - (item.values.length * barWidth) / 2;

    for (let j = 0; j < item.values.length; j++) {
      const v = item.values[j];
      const barH = (Math.abs(v.value) / maxVal) * chartHeight;
      const barX = groupX + j * barWidth;
      pdf.setFillColor(...v.color);
      pdf.rect(barX, baselineY - barH, barWidth - 1, barH, "F");
    }

    // Label
    pdf.setFontSize(6.5);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "normal");
    const labelX = margin + i * barGroupWidth + barGroupWidth / 2;
    pdf.text(item.label, labelX, baselineY + 4, { align: "center" });
  }

  return baselineY + 8;
}

// ── Header / Footer ───────────────────────────────────────────────────

function drawHeader(
  pdf: JsPDFInstance,
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
  const { pdfWidth, margin, accentColor, cabinetName, logoDataUrl, reportTitle, clientName, headerHeight } = opts;
  const [ar, ag, ab] = accentColor;

  pdf.setFillColor(ar, ag, ab);
  pdf.rect(0, 0, pdfWidth, 3, "F");

  let leftX = margin;
  if (logoDataUrl) {
    try {
      pdf.addImage(logoDataUrl, "PNG", margin, 6, 16, 16);
      leftX = margin + 20;
    } catch { /* skip */ }
  }

  if (cabinetName) {
    pdf.setFontSize(14);
    pdf.setTextColor(ar, ag, ab);
    pdf.setFont("helvetica", "bold");
    pdf.text(cabinetName, leftX, 14);
  }

  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont("helvetica", "normal");
  pdf.text(reportTitle, leftX, cabinetName ? 20 : 14);

  if (clientName) {
    pdf.setFontSize(9);
    pdf.text(`Client : ${clientName}`, leftX, cabinetName ? 25 : 19);
  }

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
  const fiscalLabel = "Donnees fiscales 2025";
  const fiscalWidth = pdf.getTextWidth(fiscalLabel);
  pdf.text(fiscalLabel, pdfWidth - margin - fiscalWidth, 17);

  pdf.setDrawColor(ar, ag, ab);
  pdf.setLineWidth(0.5);
  pdf.line(margin, margin + headerHeight - 2, pdfWidth - margin, margin + headerHeight - 2);
}

function drawFooter(
  pdf: JsPDFInstance,
  opts: {
    pdfWidth: number;
    pdfHeight: number;
    margin: number;
    accentColor: [number, number, number];
    pageNumber: number;
    cabinetName?: string;
  }
) {
  const { pdfWidth, pdfHeight, margin, accentColor, pageNumber, cabinetName } = opts;
  const [ar, ag, ab] = accentColor;
  const footerY = pdfHeight - 10;

  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 4, pdfWidth - margin, footerY - 4);

  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Ce document est une simulation a titre indicatif et ne constitue pas un conseil fiscal. Consultez votre expert-comptable.",
    margin,
    footerY
  );

  const brandText = cabinetName
    ? `${cabinetName} — Genere par FiscalAI`
    : "Genere par FiscalAI";
  pdf.setTextColor(ar, ag, ab);
  pdf.setFontSize(7);
  const rightText = `${brandText}  |  Page ${pageNumber}`;
  const rightWidth = pdf.getTextWidth(rightText);
  pdf.text(rightText, pdfWidth - margin - rightWidth, footerY);
}

// ── Renderers ──────────────────────────────────────────────────────────

function renderRemuneration(
  pdf: JsPDFInstance,
  result: SimulationResult,
  accent: [number, number, number],
  startY: number,
  margin: number,
  pdfWidth: number,
  pdfHeight: number
): number {
  const { tns, sasu } = result;
  const cardWidth = (pdfWidth - margin * 2 - 6) / 2;
  let y = startY;

  // Summary cards
  drawMetricCard(pdf, margin, y, cardWidth, "Regime recommande", result.regimeRecommande === "TNS" ? "TNS (EURL)" : "SASU", accent);
  drawMetricCard(pdf, margin + cardWidth + 6, y, cardWidth, "Economie", fmtCurrency(result.economie), accent);
  y += 24;

  // Comparison table
  y = drawSectionTitle(pdf, "Comparaison TNS vs SASU", y, accent, margin);

  const colWidth = (pdfWidth - margin * 2 - 4) / 3;
  const columns: TableColumn[] = [
    { label: "Poste", width: colWidth, align: "left" },
    { label: "TNS (EURL)", width: colWidth, align: "right" },
    { label: "SASU", width: colWidth, align: "right" },
  ];

  const rows: TableRow[] = [
    { cells: ["Remuneration brute", fmtCurrency(tns.remunerationBrute), fmtCurrency(sasu.remunerationBrute)] },
    { cells: ["Charges sociales", fmtCurrency(tns.chargesSociales), fmtCurrency(sasu.chargesSociales)] },
    { cells: ["Net avant IR", fmtCurrency(tns.netAvantIR), fmtCurrency(sasu.netAvantIR)] },
    { cells: ["Impot sur le revenu", fmtCurrency(tns.ir.impotNet), fmtCurrency(sasu.ir.impotNet)] },
    { cells: ["Taux marginal IR", fmtPercent(tns.ir.tauxMarginal), fmtPercent(sasu.ir.tauxMarginal)] },
    { cells: ["Net apres IR", fmtCurrency(tns.netApresIR), fmtCurrency(sasu.netApresIR)], bold: true },
    { cells: ["Cout total entreprise", fmtCurrency(tns.coutTotalEntreprise), fmtCurrency(sasu.coutTotalEntreprise)] },
    { cells: ["Benefice residuel", fmtCurrency(tns.beneficeResiduel), fmtCurrency(sasu.beneficeResiduel)] },
    { cells: ["IS", fmtCurrency(tns.is.montant), fmtCurrency(sasu.is.montant)] },
    { cells: ["Dividendes bruts", fmtCurrency(tns.dividendes.montantBrut), fmtCurrency(sasu.dividendes.montantBrut)] },
    { cells: ["Flat tax (30%)", fmtCurrency(tns.dividendes.flatTax), fmtCurrency(sasu.dividendes.flatTax)] },
    { cells: ["Dividendes nets", fmtCurrency(tns.dividendes.montantNet), fmtCurrency(sasu.dividendes.montantNet)] },
    { cells: ["Revenu total dirigeant", fmtCurrency(tns.revenuTotalDirigeant), fmtCurrency(sasu.revenuTotalDirigeant)], bold: true, highlight: true },
  ];

  y = drawTable(pdf, y, columns, rows, accent, margin, pdfWidth, pdfHeight);
  y += 6;

  // Bar chart
  if (y + 60 < pdfHeight - 20) {
    y = drawSectionTitle(pdf, "Comparaison graphique", y, accent, margin);
    const blue: [number, number, number] = [37, 99, 235];
    const orange: [number, number, number] = [234, 88, 12];

    y = drawBarChart(pdf, y, [
      { label: "Charges", values: [{ value: tns.chargesSociales, color: blue, legend: "TNS" }, { value: sasu.chargesSociales, color: orange, legend: "SASU" }] },
      { label: "Net apres IR", values: [{ value: tns.netApresIR, color: blue, legend: "TNS" }, { value: sasu.netApresIR, color: orange, legend: "SASU" }] },
      { label: "Cout entreprise", values: [{ value: tns.coutTotalEntreprise, color: blue, legend: "TNS" }, { value: sasu.coutTotalEntreprise, color: orange, legend: "SASU" }] },
      { label: "Dividendes nets", values: [{ value: tns.dividendes.montantNet, color: blue, legend: "TNS" }, { value: sasu.dividendes.montantNet, color: orange, legend: "SASU" }] },
      { label: "Revenu total", values: [{ value: tns.revenuTotalDirigeant, color: blue, legend: "TNS" }, { value: sasu.revenuTotalDirigeant, color: orange, legend: "SASU" }] },
    ], margin, pdfWidth, pdfHeight);
  }

  return y;
}

function renderIsIr(
  pdf: JsPDFInstance,
  result: IsIrResult,
  accent: [number, number, number],
  startY: number,
  margin: number,
  pdfWidth: number,
  pdfHeight: number
): number {
  let y = startY;
  const cardWidth = (pdfWidth - margin * 2 - 12) / 3;

  // Summary cards
  drawMetricCard(pdf, margin, y, cardWidth, "Regime recommande", result.regimeRecommande === "IS" ? "Impot Societes" : "Impot Revenu", accent);
  drawMetricCard(pdf, margin + cardWidth + 6, y, cardWidth, "Cumul IS (3 ans)", fmtCurrency(result.cumulIS), accent);
  drawMetricCard(pdf, margin + (cardWidth + 6) * 2, y, cardWidth, "Cumul IR (3 ans)", fmtCurrency(result.cumulIR), accent);
  y += 24;

  // Recommendation banner
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(margin, y, pdfWidth - margin * 2, 10, 2, 2, "F");
  pdf.setFontSize(9);
  pdf.setTextColor(22, 101, 52);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `${result.regimeRecommande} recommande — Economie de ${fmtCurrency(result.economie)} sur 3 ans`,
    margin + 4,
    y + 6.5
  );
  y += 16;

  // Year-by-year table
  y = drawSectionTitle(pdf, "Detail annee par annee", y, accent, margin);

  const contentW = pdfWidth - margin * 2 - 4;
  const firstColW = contentW * 0.28;
  const yearColW = (contentW - firstColW) / result.annees.length;
  const halfYearColW = yearColW / 2;

  // Build columns: Indicateur, then for each year two sub-columns (IS, IR)
  const columns: TableColumn[] = [
    { label: "Indicateur", width: firstColW, align: "left" },
  ];
  for (const a of result.annees) {
    columns.push({ label: `An ${a.annee} - IS`, width: halfYearColW, align: "right" });
    columns.push({ label: `An ${a.annee} - IR`, width: halfYearColW, align: "right" });
  }

  const rows: TableRow[] = [
    {
      cells: [
        "Benefice",
        ...result.annees.flatMap((a) => [fmtCurrency(a.benefice), fmtCurrency(a.benefice)]),
      ],
    },
    {
      cells: [
        "Charges sociales",
        ...result.annees.flatMap((a) => [fmtCurrency(a.is.chargesSociales), fmtCurrency(a.ir.chargesSociales)]),
      ],
    },
    {
      cells: [
        "Impots",
        ...result.annees.flatMap((a) => [
          fmtCurrency(a.is.montantIS + a.is.irSurRemuneration + a.is.flatTax),
          fmtCurrency(a.ir.montantIR),
        ]),
      ],
    },
    {
      cells: [
        "Dividendes nets",
        ...result.annees.flatMap((a) => [fmtCurrency(a.is.dividendesNets), "—"]),
      ],
    },
    {
      cells: [
        "Reserves",
        ...result.annees.flatMap((a) => [fmtCurrency(a.is.reserves), "—"]),
      ],
    },
    {
      cells: [
        "Revenu total dirigeant",
        ...result.annees.flatMap((a) => [fmtCurrency(a.is.revenuTotalDirigeant), fmtCurrency(a.ir.revenuApresIR)]),
      ],
      bold: true,
      highlight: true,
    },
    {
      cells: [
        "Avantage IS",
        ...result.annees.flatMap((a) => [
          (a.avantageIS >= 0 ? "+" : "") + fmtCurrency(a.avantageIS),
          "",
        ]),
      ],
      bold: true,
    },
  ];

  y = drawTable(pdf, y, columns, rows, accent, margin, pdfWidth, pdfHeight);
  y += 6;

  // Bar chart
  if (y + 60 < pdfHeight - 20) {
    y = drawSectionTitle(pdf, "Revenus compares", y, accent, margin);
    const blue: [number, number, number] = [37, 99, 235];
    const orange: [number, number, number] = [234, 88, 12];

    y = drawBarChart(pdf, y, result.annees.map((a) => ({
      label: `Annee ${a.annee}`,
      values: [
        { value: a.is.revenuTotalDirigeant, color: blue, legend: "IS" },
        { value: a.ir.revenuApresIR, color: orange, legend: "IR" },
      ],
    })), margin, pdfWidth, pdfHeight);
  }

  return y;
}

function renderStatuts(
  pdf: JsPDFInstance,
  result: StatutsResult,
  accent: [number, number, number],
  startY: number,
  margin: number,
  pdfWidth: number,
  pdfHeight: number
): number {
  let y = startY;

  // Recommendation
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(margin, y, pdfWidth - margin * 2, 10, 2, 2, "F");
  pdf.setFontSize(9);
  pdf.setTextColor(22, 101, 52);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Statut recommande : ${result.recommandation.statut}`,
    margin + 4,
    y + 6.5
  );
  y += 14;

  // Reasons
  pdf.setFontSize(8);
  pdf.setTextColor(60, 60, 60);
  pdf.setFont("helvetica", "normal");
  for (const raison of result.recommandation.raisons) {
    pdf.text(`• ${raison}`, margin + 2, y);
    y += 5;
  }
  y += 4;

  // Comparison table
  y = drawSectionTitle(pdf, "Comparaison des statuts", y, accent, margin);

  const contentW = pdfWidth - margin * 2 - 4;
  const firstColW = contentW * 0.22;
  const statutColW = (contentW - firstColW) / result.statuts.length;

  const columns: TableColumn[] = [
    { label: "Indicateur", width: firstColW, align: "left" },
    ...result.statuts.map((s) => ({
      label: s.label,
      width: statutColW,
      align: "right" as const,
    })),
  ];

  const rows: TableRow[] = [
    {
      cells: ["Net disponible", ...result.statuts.map((s) => fmtCurrency(s.netDisponible))],
      bold: true,
      highlight: true,
    },
    {
      cells: ["Charges sociales", ...result.statuts.map((s) => fmtCurrency(s.chargesSociales))],
    },
    {
      cells: ["Taux charges", ...result.statuts.map((s) => fmtPercent(s.tauxCharges))],
    },
    {
      cells: ["Cout entreprise", ...result.statuts.map((s) => fmtCurrency(s.coutTotalEntreprise))],
    },
    {
      cells: ["IS", ...result.statuts.map((s) => fmtCurrency(s.imposition.montantIS))],
    },
    {
      cells: ["IR", ...result.statuts.map((s) => fmtCurrency(s.imposition.montantIR))],
    },
    {
      cells: ["Dividendes nets", ...result.statuts.map((s) => fmtCurrency(s.imposition.dividendesNets))],
    },
  ];

  y = drawTable(pdf, y, columns, rows, accent, margin, pdfWidth, pdfHeight);
  y += 6;

  // Protection sociale table
  y = drawSectionTitle(pdf, "Protection sociale", y, accent, margin);

  const protColumns: TableColumn[] = [
    { label: "Critere", width: firstColW, align: "left" },
    ...result.statuts.map((s) => ({
      label: s.label,
      width: statutColW,
      align: "center" as const,
    })),
  ];

  const protRows: TableRow[] = [
    { cells: ["Retraite", ...result.statuts.map((s) => s.protectionSociale.retraite)] },
    { cells: ["Prevoyance", ...result.statuts.map((s) => s.protectionSociale.prevoyance)] },
    { cells: ["Indemnites journalieres", ...result.statuts.map((s) => s.protectionSociale.indemniteJournaliere ? "Oui" : "Non")] },
    { cells: ["Assurance chomage", ...result.statuts.map((s) => s.protectionSociale.assuranceChomage ? "Oui" : "Non")] },
  ];

  y = drawTable(pdf, y, protColumns, protRows, accent, margin, pdfWidth, pdfHeight);
  y += 6;

  // Bar chart
  if (y + 60 < pdfHeight - 20) {
    y = drawSectionTitle(pdf, "Comparaison graphique", y, accent, margin);
    const colors: [number, number, number][] = [
      [37, 99, 235],
      [234, 88, 12],
      [22, 163, 74],
      [147, 51, 234],
    ];

    y = drawBarChart(pdf, y, [
      {
        label: "Net disponible",
        values: result.statuts.map((s, i) => ({
          value: s.netDisponible,
          color: colors[i % colors.length],
          legend: s.label,
        })),
      },
      {
        label: "Charges sociales",
        values: result.statuts.map((s, i) => ({
          value: s.chargesSociales,
          color: colors[i % colors.length],
          legend: s.label,
        })),
      },
      {
        label: "Cout entreprise",
        values: result.statuts.map((s, i) => ({
          value: s.coutTotalEntreprise,
          color: colors[i % colors.length],
          legend: s.label,
        })),
      },
    ], margin, pdfWidth, pdfHeight);
  }

  return y;
}

// ── Main export ────────────────────────────────────────────────────────

export async function generatePDF(
  data: PdfData,
  filename: string = "simulation-fiscalai.pdf",
  options: PdfOptions = {}
) {
  const jspdfModule = await import("jspdf");
  const { jsPDF } = jspdfModule;

  const { branding, clientName, reportTitle } = options;
  const accentColor = branding?.accentColor ?? "#2563eb";
  const accent = hexToRgb(accentColor);

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const headerHeight = 28;

  // Draw header on first page
  drawHeader(pdf, {
    pdfWidth,
    margin,
    accentColor: accent,
    cabinetName: branding?.cabinetName,
    logoDataUrl: branding?.logoDataUrl ?? null,
    reportTitle: reportTitle ?? "Rapport de Simulation Fiscale",
    clientName,
    headerHeight,
  });

  const contentTop = margin + headerHeight + 4;

  // Render content based on type
  let finalY: number;
  switch (data.type) {
    case "remuneration":
      finalY = renderRemuneration(pdf, data.result, accent, contentTop, margin, pdfWidth, pdfHeight);
      break;
    case "is_vs_ir":
      finalY = renderIsIr(pdf, data.result, accent, contentTop, margin, pdfWidth, pdfHeight);
      break;
    case "comparateur_statuts":
      finalY = renderStatuts(pdf, data.result, accent, contentTop, margin, pdfWidth, pdfHeight);
      break;
  }

  // Draw footer on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    // Draw header on pages after first
    if (i > 1) {
      drawHeader(pdf, {
        pdfWidth,
        margin,
        accentColor: accent,
        cabinetName: branding?.cabinetName,
        logoDataUrl: branding?.logoDataUrl ?? null,
        reportTitle: reportTitle ?? "Rapport de Simulation Fiscale",
        clientName,
        headerHeight,
      });
    }
    drawFooter(pdf, {
      pdfWidth,
      pdfHeight,
      margin,
      accentColor: accent,
      pageNumber: i,
      cabinetName: branding?.cabinetName,
    });
  }

  pdf.save(filename);
}
