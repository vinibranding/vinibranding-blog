import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vini's Branding Lab",
  description: "Vini's Branding Lab - 퍼스널 브랜딩 및 커리어 컨설팅",
  alternates: {
    types: {
      'application/rss+xml': 'https://vinibranding.com/rss.xml',
    },
  },
  verification: {
    google: 'gHmBQyZ4xYzHqYyToTisbh9lTZhd31z7sFlpmNwYXVU',
    other: {
      'naver-site-verification': 'd73740a31c12346e328fa3bcb2a10a67aca59597',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}

