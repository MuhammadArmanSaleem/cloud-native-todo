import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import AppShell from "./components/layout/AppShell";
import { LanguageProvider } from "./contexts/LanguageContext";
import { VoiceCommandProvider } from "./contexts/VoiceCommandContext";

// Using Inter as substitute for DejaVu Sans (closest available)
// DejaVu Sans is not available via next/font/google, so we use Inter as a modern alternative
const interHeading = Inter({
  subsets: ["latin"],
  weight: ["700"], // Bold for headings
  variable: "--font-dejavu-sans-bold",
  display: "swap",
});

const interBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500"], // Regular and medium for body
  variable: "--font-dejavu-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todo App - Tech Innovation",
  description: "A modern todo application with techy minimalist design",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${interHeading.variable} ${interBody.variable}`}>
      <body>
        <LanguageProvider>
          <VoiceCommandProvider>
            <AppShell>{children}</AppShell>
          </VoiceCommandProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
