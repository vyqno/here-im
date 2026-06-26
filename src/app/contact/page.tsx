import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Contact us | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Say hello"
      title="Contact us"
      intro="Questions, catering, or just to tell us your favourite sandwich — we're listening."
      sections={[
        {
          heading: "Reach the kitchen",
          paragraphs: [
            "Email: hello@here-im.in",
            "12, 100 Feet Road, Jayanagar, Bengaluru — 560011",
            "Open Wednesday to Sunday, 8:15 am to 6:00 pm.",
          ],
        },
        {
          heading: "Deliveries & events",
          paragraphs: [
            "For private events or bulk pre-orders, drop us a line with your date and group size and we'll take it from there.",
          ],
        },
      ]}
    />
  );
}
