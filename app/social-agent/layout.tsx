import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Social Agent — AI Comment & DM Replies",
  description: "Create on-brand AI replies for Instagram and Facebook comments and direct messages with human approval controls.",
  alternates: { canonical: "/social-agent" },
};

export default function SocialAgentLayout({ children }: { children: ReactNode }) {
  return children;
}
