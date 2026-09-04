// Product reads for the public menu. Runs on the server (Server
// Components) against Supabase. Prices are stored in paise and
// converted to rupees at the edge of the data layer.
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export interface MenuProduct {
  id: string;
  name: string;
  /** Short tagline shown under the product (DB: description). */
  desc: string;
  /** Price in rupees (DB stores paise). */
  price: number;
}

/**
 * Active menu products in their configured display order.
 * Mirrors the order the storefront grid renders.
 */
const LOCAL_MENU: MenuProduct[] = [
  { id: "sandwich-classic", name: "Classic", desc: "Pressed sourdough, house pickles.", price: 280 },
  { id: "sandwich-caprese", name: "Caprese", desc: "Tomato, mozzarella, basil.", price: 320 },
  { id: "sandwich-smoked", name: "Smoked", desc: "Smoked filling on ciabatta.", price: 340 },
  { id: "fries-classic", name: "Classic fries", desc: "Double-fried, seasoned to order.", price: 160 },
  { id: "fries-truffle", name: "Truffle Parmesan", desc: "Loaded fries, truffle, parmesan.", price: 220 },
  { id: "fries-sweet", name: "Sweet potato", desc: "Crisp sweet potato fries.", price: 180 },
];

export async function getMenuProducts(): Promise<MenuProduct[]> {
  if (!hasSupabase) return LOCAL_MENU;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price_paise, display_order")
    .eq("status", "active")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load menu products: ${error.message}`);
  }

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    desc: p.description ?? "",
    price: p.price_paise / 100,
  }));
}
