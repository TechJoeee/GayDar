import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAYDAR",
  description: "A ridiculous 5-question meme quiz with a fake Gaydar score.",
  icons: {
    icon: "/gaydar-logo-v2.png",
    shortcut: "/gaydar-logo-v2.png",
    apple: "/gaydar-logo-v2.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
