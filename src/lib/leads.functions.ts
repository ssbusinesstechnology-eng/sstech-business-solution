import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactBits = {
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[0-9+()\-\s]*$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
};

const contactSchema = z.object({
  ...contactBits,
  service: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

const blank = (v?: string) => (v && v.trim() ? v.trim() : null);

/** Never surface raw database errors to visitors. */
function friendlyFailure(scope: string, error: unknown): never {
  console.error(`[${scope}]`, error);
  throw new Error("Something went wrong. Please try again.");
}

export const submitContactLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("contact_leads").insert({
      name: data.name.trim(),
      business_name: blank(data.businessName),
      email: blank(data.email),
      phone: blank(data.phone),
      service: blank(data.service),
      message: data.message.trim(),
    });
    if (error) friendlyFailure("submitContactLead", error);

    return { ok: true };
  });
