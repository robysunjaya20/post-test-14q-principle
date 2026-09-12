import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "14 Q Principle | Post Test",
  description: "Post Test 14 Q Principle - PT. Bumjin Electronics Indonesia",

  openGraph: {
    title: "14 Q Principle - Post Test",
    description: "Post Test 14 Q Principle",
    url: "https://post-test-14q-principle.vercel.app/",
    siteName: "14 Q Principle",
    images: [
      {
        url: "/og_bei.png",
        width: 800,
        height: 450,
        alt: "PT Bumjin Electronics Indonesia",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}