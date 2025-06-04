import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muffa - Gestione Frigo Smart",
  description: "Riduci gli sprechi alimentari con il tuo assistente digitale per il frigorifero",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
        <body className={inter.className}>{children}</body>
    </html>
  );
}