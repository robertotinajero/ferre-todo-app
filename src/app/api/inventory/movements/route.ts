import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const movementTypes = ["entrada", "salida", "ajuste", "venta"] as const;

export async function POST(request: Request) {
  const body = await request.json();
  const productId = String(body.productId || "");
  const type = String(body.type || "").toLowerCase();
  const quantity = Number(body.quantity);
  const note = body.note ? String(body.note) : null;

  if (
    !productId ||
    !movementTypes.includes(type as (typeof movementTypes)[number])
  ) {
    return NextResponse.json(
      { error: "Producto y tipo de movimiento son obligatorios." },
      { status: 400 },
    );
  }

  if (quantity <= 0) {
    return NextResponse.json(
      { error: "La cantidad debe ser mayor a cero." },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase.rpc("apply_inventory_movement", {
    target_product_id: productId,
    movement_type: type as (typeof movementTypes)[number],
    movement_quantity: quantity,
    movement_note: note,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ quantity: data });
}
