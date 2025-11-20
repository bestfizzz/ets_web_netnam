import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NETN@M™ AI Search",
  description: "Event image search platform by NETN@M",
  icons: {
    icon: "/logo/icon.png",          // this is your favicon
    shortcut: "/logo/icon.png",      // optional
    apple: "/logo/icon.png",         // optional Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://umami.dizzd.website/script.js" data-website-id="ab2c7b6a-9208-45df-bf42-14e9d72ba79a"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
