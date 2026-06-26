import { getMenuProducts } from "@/features/products/queries";
import HomeClient from "./HomeClient";

// Server Component: load the menu from the database, then hand it to
// the interactive client UI. Visuals are unchanged — only the data
// source moved from a hardcoded array to Supabase.
export default async function Page() {
  const products = await getMenuProducts();
  return <HomeClient products={products} />;
}
