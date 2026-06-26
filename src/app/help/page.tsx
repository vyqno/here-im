import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Help | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Support"
      title="Help"
      intro="Everything you need to know about ordering, pickup, and payments."
      sections={[
        {
          heading: "How pickup works",
          paragraphs: [
            "Add items to your bag, choose a collection date and time at checkout, and pay online. We'll have your order ready and wrapped warm when you arrive.",
            "Pickup is available Wednesday to Sunday, 8:15 am to 6:00 pm. Closed Monday and Tuesday.",
          ],
        },
        {
          heading: "Payments & changes",
          paragraphs: [
            "We accept secure online payments at checkout. If you need to change or cancel an order, reach us as early as possible at hello@here-im.in.",
          ],
        },
      ]}
    />
  );
}
