import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug), inventory(quantity, min_quantity)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const sku = String(body.sku || "").trim().toUpperCase();
  const price = Number(body.price);
  const categoryId = body.categoryId ? String(body.categoryId) : null;
  const quantity = Number(body.quantity || 0);
  const minQuantity = Number(body.minQuantity || 0);

  if (!name || !sku || price <= 0) {
    return NextResponse.json(
      { error: "Nombre, SKU y precio son obligatorios." },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabaseClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      sku,
      slug: `${slugify(name)}-${sku.toLowerCase()}`,
      price,
      category_id: categoryId,
      active: true,
    })
    .select()
    .single();

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  const { error: inventoryError } = await supabase.from("inventory").insert({
    product_id: product.id,
    quantity: Math.max(0, quantity),
    min_quantity: Math.max(0, minQuantity),
  });

  if (inventoryError) {
    return NextResponse.json(
      { error: inventoryError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ product }, { status: 201 });
}
