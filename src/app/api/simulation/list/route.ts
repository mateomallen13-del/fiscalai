import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const type = url.searchParams.get("type");

    let query = supabase
      .from("simulations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq("type", type);
    }

    const { data: simulations, error } = await query;

    if (error) {
      console.error("List simulations error:", error);
      return NextResponse.json(
        { error: "Erreur lors du chargement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ simulations });
  } catch (error) {
    console.error("List simulations error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
