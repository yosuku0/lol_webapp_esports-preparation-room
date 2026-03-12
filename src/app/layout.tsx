import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eSports Prep Room",
  description: "Advanced LoL Match Analyst",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

