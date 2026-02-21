import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Polyglot Escape — Multilingual Escape Room",
  description:
    "A multilingual escape room game where every clue is in a different language. Use the magic magnifying glass powered by Lingo.dev to translate and escape!",
  keywords: ["escape room", "multilingual", "lingo.dev", "language game", "puzzle"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
