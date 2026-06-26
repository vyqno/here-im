import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "About | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="The kitchen"
      title="About us"
      intro="A small artisanal sandwich and fries kitchen in Jayanagar, Bengaluru — open Wednesday to Sunday."
      sections={[
        {
          heading: "What we believe",
          paragraphs: [
            "Quality is the default, not the upgrade. We keep the menu tight, the ingredients honest, and the experience calm — from the first tap to the last bite.",
          ],
        },
        {
          heading: "Visit us",
          paragraphs: [
            "12, 100 Feet Road, Jayanagar, Bengaluru — 560011.",
            "Wednesday to Sunday, 8:15 am to 6:00 pm. Pickup only, for now.",
          ],
        },
      ]}
    />
  );
}
