import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Dashboard — Analytics & Insights",
  description:
    "Modern SaaS analytics dashboard. Monitor revenue, users, conversions and activity in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: inter.style.fontFamily }}>{children}</body>
    </html>
  );
}
