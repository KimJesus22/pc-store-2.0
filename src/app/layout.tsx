import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GhostWire MX | H/W Marketplace",
  description: "Compra y vende hardware verificado en México.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${spaceMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

