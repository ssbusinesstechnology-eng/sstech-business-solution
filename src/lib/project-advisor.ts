export type ProjectRecommendation = {
  serviceArea: string;
  packageName: "Starter" | "Basic" | "Premium" | "Pro";
  summary: string;
  budgetFit: string;
  timelineFit: string;
  nextSteps: string[];
  considerations: string[];
};