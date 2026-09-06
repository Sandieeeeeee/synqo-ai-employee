import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Social Agent Workspace",
  description: "Your private Synqo Social Agent workspace.",
  robots: { index: false, follow: false },
};

export default function SocialAgentAppLayout({ children }: { children: ReactNode }) {
  return children;
}
