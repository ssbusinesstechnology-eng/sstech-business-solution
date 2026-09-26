import type { ProjectRecommendation } from "@/lib/project-advisor";
import { EMAIL, SITE_NAME, SITE_URL, TAGLINE, WHATSAPP_PRIMARY } from "@/lib/site";

type BriefInput = {
  goals: string;
  budget: string;
  timeline: string;
  recommendation: ProjectRecommendation;
};

const INK = [29, 12, 5] as const;
const COPPER = [181, 112, 45] as const;
const PAPER = [247, 244, 239] as const;
const MUTED = [92, 82, 76] as const;

export async function downloadProjectBrief(input: BriefInput) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const addPage = () => {
    pdf.addPage();
    pdf.setFillColor(...PAPER);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    y = 20;
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - 20) addPage();
  };

  const sectionTitle = (label: string) => {
    ensureSpace(14);
    pdf.setTextColor(...COPPER);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(label.toUpperCase(), margin, y);
    y += 6;
  };

  const paragraph = (text: string, options?: { bold?: boolean; size?: number; color?: readonly [number, number, number] }) => {
    const size = options?.size ?? 10;
    pdf.setFont("helvetica", options?.bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...(options?.color ?? MUTED));
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    const height = lines.length * (size * 0.42) + 3;
    ensureSpace(height);
    pdf.text(lines, margin, y);
    y += height;
  };

  pdf.setFillColor(...PAPER);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.setFillColor(...INK);
  pdf.rect(0, 0, pageWidth, 68, "F");
  pdf.setFillColor(...COPPER);
  pdf.rect(0, 0, 5, 68, "F");
  pdf.setTextColor(...COPPER);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text(SITE_NAME.toUpperCase(), margin, 18);
  pdf.setTextColor(...PAPER);
  pdf.setFontSize(24);
  pdf.text("Tailored project brief", margin, 34);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(TAGLINE, margin, 44);
  pdf.setTextColor(210, 198, 190);
  pdf.setFontSize(8);
  pdf.text(`Prepared ${new Intl.DateTimeFormat("en-KE", { dateStyle: "long" }).format(new Date())}`, margin, 55);
  y = 82;

  sectionTitle("Recommended starting point");
  paragraph(input.recommendation.packageName, { bold: true, size: 22, color: INK });
  paragraph(input.recommendation.serviceArea, { bold: true, size: 11, color: COPPER });
  y += 2;
  paragraph(input.recommendation.summary);
  y += 4;

  sectionTitle("Your project");
  paragraph(`Goals  |  ${input.goals}`);
  paragraph(`Working budget  |  ${input.budget}`);
  paragraph(`Preferred timeline  |  ${input.timeline}`);
  y += 4;

  sectionTitle("Fit assessment");
  paragraph("Budget fit", { bold: true, color: INK });
  paragraph(input.recommendation.budgetFit);
  paragraph("Timeline fit", { bold: true, color: INK });
  paragraph(input.recommendation.timelineFit);
  y += 4;

  sectionTitle("Tailored next steps");
  input.recommendation.nextSteps.forEach((step, index) => {
    paragraph(`${index + 1}.  ${step}`);
  });

  if (input.recommendation.considerations.length > 0) {
    y += 4;
    sectionTitle("Important considerations");
    input.recommendation.considerations.forEach((item) => paragraph(`•  ${item}`));
  }

  ensureSpace(32);
  y += 8;
  pdf.setDrawColor(...COPPER);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 9;
  paragraph("Ready to refine the scope?", { bold: true, size: 12, color: INK });
  paragraph(`WhatsApp: +${WHATSAPP_PRIMARY}   |   Email: ${EMAIL}`);
  pdf.setTextColor(...COPPER);
  pdf.textWithLink(SITE_URL, margin, y, { url: SITE_URL });

  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(130, 119, 112);
    pdf.text(
      `AI-assisted recommendation for planning; final scope and pricing are confirmed by S&S.  ${page}/${pages}`,
      margin,
      pageHeight - 9,
    );
  }

  const packageSlug = input.recommendation.packageName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  pdf.save(`ss-project-brief-${packageSlug}.pdf`);
}