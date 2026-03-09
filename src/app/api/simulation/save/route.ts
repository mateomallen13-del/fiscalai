import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FREE_TIER_LIMIT = 3;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check subscription status
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, simulation_count")
      .eq("id", user.id)
      .single();

    if (
      profile?.subscription_status !== "active" &&
      (profile?.simulation_count ?? 0) >= FREE_TIER_LIMIT
    ) {
      return NextResponse.json(
        {
          error: "Limite atteinte",
          message:
            "Vous avez atteint la limite de 3 simulations gratuites. Passez au plan Pro pour continuer.",
        },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { type, input_data, result_data, client_name } = body;

    // Save simulation
    const { data: simulation, error: insertError } = await supabase
      .from("simulations")
      .insert({
        user_id: user.id,
        type: type || "remuneration_dirigeant",
        client_name: client_name || null,
        input_data,
        result_data,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Save simulation error:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de la sauvegarde" },
        { status: 500 }
      );
    }

    // Increment simulation count
    await supabase
      .from("profiles")
      .update({
        simulation_count: (profile?.simulation_count ?? 0) + 1,
      })
      .eq("id", user.id);

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error("Save simulation error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
