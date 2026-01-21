import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ArVrBackground } from "@/components/arvr-background";
import { auth } from "@/auth";
import { SecurityBot } from "@/components/features/security-bot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IDTrace - Enterprise Risk Intelligence",
  description: "Advanced digital footprint analysis and security monitoring for enterprise.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          session={session}
        >
          <ArVrBackground />
          <SecurityBot />
          {children}
        </Providers>
      </body>
    </html>
  );
}
