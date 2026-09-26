import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { recommendProject } from "@/lib/project-advisor.server";

const inputSchema = z.object({
  goals: z.string().trim().min(20, "Tell us a little more about your project goals.").max(1200),
  budget: z.string().trim().min(1).max(80),
  timeline: z.string().trim().min(1).max(80),
});

export const getProjectRecommendation = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => recommendProject(data));