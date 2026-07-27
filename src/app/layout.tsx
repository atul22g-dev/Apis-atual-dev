import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: Allow importing global CSS without type declarations
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atual APIs | Dashboard",
  description: "A comprehensive collection of APIs for projects, movies, products, wallpapers and more.",
  keywords: ["apis", "projects", "movies", "products", "wallpapers", "dashboard"],
  openGraph: {
    title: "Atual APIs",
    description: "Your central API hub for projects, movies, products and more.",
    type: "website",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-[#070708]`} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
