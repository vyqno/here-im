import type { Metadata } from "next";
import EditorialPage from "@/components/EditorialPage";

export const metadata: Metadata = { title: "Join us | HERE I'M" };

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Careers"
      title="Join us"
      intro="We're a small team that cares a lot about the details. If that sounds like you, we'd love to hear from you."
      sections={[
        {
          heading: "Open kitchen & counter roles",
          paragraphs: [
            "We hire for attitude first and train the craft. Whether you're behind the pass or at the counter, you'll help shape how HERE I'M feels to every guest.",
          ],
        },
        {
          heading: "How to apply",
          paragraphs: [
            "Send a short note about yourself to hello@here-im.in. Tell us what you love to make — or to eat. No formal résumé required.",
          ],
        },
      ]}
    />
  );
}
