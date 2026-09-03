import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import { AuthProvider } from "./contexts/AuthContext";
import BusinessAssistant from "./components/BusinessAssistant";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://synqoai.com"),
  title: { default: "Synqo AI | AI Employee for Modern Businesses", template: "%s | Synqo AI" },
  description: "Synqo AI is building Synqo AI Employee, an intelligent business assistant designed to help with customer enquiries, lead capture, appointments, follow-ups and repetitive business workflows.",
  keywords: ["Synqo AI","Synqo AI Employee","AI employee","AI business assistant","AI automation","business automation","AI customer service","lead automation","appointment automation","AI follow up","AI software","business AI","Canadian AI company"],
  authors: [{ name: "Synqo AI", url: "https://synqoai.com" }], creator: "Synqo AI", publisher: "Synqo AI", applicationName: "Synqo AI", category: "technology",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_CA", url: "https://synqoai.com", siteName: "Synqo AI", title: "Synqo AI | Your AI Employee for Everyday Business Work", description: "Handle customer enquiries, capture leads, book appointments, send follow-ups and automate repetitive business work with Synqo AI Employee.", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Synqo AI Employee" }] },
  twitter: { card: "summary_large_image", title: "Synqo AI | Your AI Employee for Everyday Business Work", description: "Synqo AI Employee helps businesses handle customer enquiries, leads, appointments, follow-ups and repetitive workflows.", images: ["/og-image.png"] },
  icons: { icon: "/favicon.ico" }, robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <BusinessAssistant />

        <GoogleAnalytics gaId="G-71WW2Q58VY" />

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xqbh5yo015");
          `}
        </Script>
      </body>
    </html>
  );
}
