import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Promotes the signed-in user to admin, but only while no admin exists yet.
 * Runs entirely on the server so the rule cannot be bypassed from the browser.
 */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) {
      console.error("[claimAdmin:count]", countError);
      throw new Error("Something went wrong. Please try again.");
    }
    if ((count ?? 0) > 0) return { granted: false };

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) {
      console.error("[claimAdmin:insert]", error);
      throw new Error("Something went wrong. Please try again.");
    }
    return { granted: true };
  });
