import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Events | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Private events upon request"
      title="Creations"
      intro="From intimate gatherings to office spreads, we cater our sandwiches and fries for groups across Bengaluru."
      sections={[
        {
          heading: "Catering & boxes",
          paragraphs: [
            "Platters, individual boxes, and seasonal specials prepared for your headcount and ready at your chosen time. Tell us the occasion and we'll build a menu around it.",
          ],
        },
        {
          heading: "Get in touch",
          paragraphs: [
            "For private events and bulk pre-orders, write to us at hello@here-im.in with your date, group size, and any preferences. We'll respond within one working day.",
          ],
        },
      ]}
    />
  );
}
