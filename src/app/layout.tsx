import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NOX - Anonymous Ephemeral Chat",
  description: "Conversations that vanish like shadows. Anonymous, ephemeral, real-time chat with no accounts, no history, just pure communication.",
  keywords: ["anonymous chat", "ephemeral messaging", "private chat", "secure messaging", "no registration"],
  authors: [{ name: "NOX Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} font-mono bg-nox-black text-nox-text antialiased min-h-screen`}
      >
        <div className="min-h-screen bg-gradient-to-br from-nox-black via-nox-dark to-nox-darker">
          {children}
        </div>
      </body>
    </html>
  );
}
