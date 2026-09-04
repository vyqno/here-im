"use server";

// Server-side cart operations for authenticated users. The cart lives in
// Supabase (carts / cart_items); product name/price/image are always
// resolved from the products table, never trusted from the client.
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export interface ServerCartItem {
  id: string; // product id
  name: string;
  price: number; // rupees
  image: string;
  quantity: number;
}

async function getUserId() {
  if (!hasSupabase) return { supabase: null, userId: null as string | null };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id ?? null };
}

async function getOrCreateCartId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string> {
  const { data: existing } = await supabase
    .from("carts").select("id").eq("user_id", userId).maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("carts").insert({ user_id: userId }).select("id").single();
  if (error) throw new Error(error.message);
  return created.id;
}

/** Load the signed-in user's cart with live product details. */
export async function getServerCart(): Promise<ServerCartItem[]> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return [];

  const cartId = await getOrCreateCartId(supabase, userId);
  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, quantity, products(name, price_paise, thumbnail_path, status, deleted_at)")
    .eq("cart_id", cartId);
  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((row) => {
      const p = row.products as unknown as { status: string; deleted_at: string | null } | null;
      return p && p.status !== "archived" && !p.deleted_at;
    })
    .map((row) => {
      const p = row.products as unknown as { name: string; price_paise: number; thumbnail_path: string | null };
      return {
        id: row.product_id as string,
        name: p.name,
        price: p.price_paise / 100,
        image: p.thumbnail_path ?? "",
        quantity: row.quantity as number,
      };
    });
}

/** Merge guest (localStorage) items into the DB cart, summing quantities. */
export async function mergeGuestCart(
  guestItems: { id: string; quantity: number }[],
): Promise<ServerCartItem[]> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return [];
  const cartId = await getOrCreateCartId(supabase, userId);

  if (guestItems.length > 0) {
    const { data: existing } = await supabase
      .from("cart_items").select("product_id, quantity").eq("cart_id", cartId);

    const merged = new Map<string, number>();
    for (const row of existing ?? []) merged.set(row.product_id as string, row.quantity as number);
    for (const g of guestItems) {
      if (g.quantity > 0) merged.set(g.id, (merged.get(g.id) ?? 0) + g.quantity);
    }

    const rows = [...merged.entries()].map(([product_id, quantity]) => ({ cart_id: cartId, product_id, quantity }));
    if (rows.length > 0) {
      const { error } = await supabase.from("cart_items").upsert(rows, { onConflict: "cart_id,product_id" });
      if (error) throw new Error(error.message);
    }
  }

  return getServerCart();
}

/** Set a line item's quantity (deletes when quantity <= 0). */
export async function setServerCartItem(productId: string, quantity: number): Promise<void> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return;
  const cartId = await getOrCreateCartId(supabase, userId);

  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("cart_id", cartId).eq("product_id", productId);
    return;
  }
  const { error } = await supabase
    .from("cart_items")
    .upsert({ cart_id: cartId, product_id: productId, quantity }, { onConflict: "cart_id,product_id" });
  if (error) throw new Error(error.message);
}

/** Add to an existing quantity (or create the line). */
export async function addServerCartItem(productId: string, quantity: number): Promise<void> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return;
  const cartId = await getOrCreateCartId(supabase, userId);

  const { data: existing } = await supabase
    .from("cart_items").select("quantity").eq("cart_id", cartId).eq("product_id", productId).maybeSingle();
  const next = (existing?.quantity ?? 0) + quantity;
  await setServerCartItem(productId, next);
}

export async function clearServerCart(): Promise<void> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return;
  const cartId = await getOrCreateCartId(supabase, userId);
  await supabase.from("cart_items").delete().eq("cart_id", cartId);
}
