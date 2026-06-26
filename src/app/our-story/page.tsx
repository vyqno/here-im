import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Our story | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Since 2024 · Jayanagar"
      title="Our story"
      intro="HERE I'M began with a simple idea — that a sandwich, made with care, can be the best part of someone's day."
      sections={[
        {
          heading: "It started with bread",
          paragraphs: [
            "We spent months on the loaf alone — proofing slowly, baking dark, and tasting until the crumb was right. Everything we build sits on that foundation: sourdough, multigrain, brioche, each chosen for what it carries.",
            "From there came the fillings. Real produce, small-batch sauces, and a kitchen that prefers doing fewer things exceptionally well over doing everything at once.",
          ],
        },
        {
          heading: "A café, not a counter",
          paragraphs: [
            "Even as a pickup-first kitchen, we wanted the experience to feel considered from the first tap. Order in a minute, choose your moment, and collect something that tastes like it was made for you — because it was.",
          ],
        },
      ]}
    />
  );
}
