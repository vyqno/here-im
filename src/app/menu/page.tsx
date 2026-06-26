import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Menu | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Seasonal · Pickup only"
      title="The menu"
      intro="A short, changing list of signature sandwiches and loaded fries — built from what's good right now."
      sections={[
        {
          heading: "Signature sandwiches",
          paragraphs: [
            "From the Classic on sourdough to the Mushroom Truffle on ciabatta, every sandwich is pressed to order and wrapped warm for pickup.",
            "Browse and pre-order the full list on the home page, then choose your collection slot at checkout.",
          ],
        },
        {
          heading: "Loaded fries",
          paragraphs: [
            "Double-fried and seasoned to order — Classic, Truffle Parmesan, Sweet Potato, and our Masala Frites for a little Bengaluru in every bite.",
          ],
        },
      ]}
    />
  );
}
