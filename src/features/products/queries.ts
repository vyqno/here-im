// Product reads for the public menu. Runs on the server (Server
// Components) against Supabase. Prices are stored in paise and
// converted to rupees at the edge of the data layer.
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
  // Production Supabase is currently unreachable and was stalling the
  // homepage. Serve the static menu until that backend is healthy.
  return LOCAL_MENU;
}
