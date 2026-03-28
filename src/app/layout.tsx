import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "GabWork",
  description: "Plateforme de mise en relation freelances numériques au Gabon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="antialiased bg-background text-foreground min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
