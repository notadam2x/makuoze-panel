import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Makuoze Drainer | Partner Portal',
  description: 'Enterprise Grade Crypto Revenue Management',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth selection:bg-makuoze-red/30`}>
      <body className="antialiased text-rendering-optimizeLegibility ring-white/5 min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
