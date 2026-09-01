import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const source = Source_Serif_4({ subsets: ["latin"], variable: "--font-source" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: "TrueHire — Clear opportunities. Structured recruitment.",
    template: "%s · TrueHire",
  },
  description: "TrueHire presents credible roles with complete information and a structured application process.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "TrueHire",
    description: "Clear opportunities and structured recruitment.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${source.variable} antialiased`}>{children}</body>
    </html>
  );
}
