import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get all simulations for counting
    const { data: simulations, error } = await supabase
      .from("simulations")
      .select("id, type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Stats error:", error);
      return NextResponse.json(
        { error: "Erreur lors du chargement" },
        { status: 500 }
      );
    }

    const total = simulations?.length ?? 0;
    const byType: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    for (const sim of simulations ?? []) {
      // Count by type
      byType[sim.type] = (byType[sim.type] || 0) + 1;

      // Count by month
      const month = sim.created_at?.substring(0, 7); // YYYY-MM
      if (month) {
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    }

    // Get profile for subscription info
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, simulation_count")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      total,
      byType,
      byMonth,
      subscriptionStatus: profile?.subscription_status ?? "free",
      simulationCount: profile?.simulation_count ?? 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
