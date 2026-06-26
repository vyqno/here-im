import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Privacy | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Your data"
      title="Privacy"
      intro="We collect only what we need to take your order and improve your experience — nothing more."
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "When you order, we store your contact details, order history, and pickup preferences so we can prepare your food and let you reorder easily. Authentication is handled securely through your Google or Apple account.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "We never sell your data. We use it to process orders, send order confirmations, and — only with your consent — share the occasional update. You can request deletion of your account at any time.",
            "Questions about your data? Write to hello@here-im.in.",
          ],
        },
      ]}
    />
  );
}
