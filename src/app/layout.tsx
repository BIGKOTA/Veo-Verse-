import { Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";

const TempoInit = dynamic(() => import("@/components/tempo-init"), {
  ssr: false,
});

const ClientThemeProvider = dynamic(
  () => import("@/components/client-theme-provider"),
  {
    ssr: false,
  },
);

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientThemeProvider>
          {children}
          <TempoInit />
        </ClientThemeProvider>
        {process.env.NEXT_PUBLIC_TEMPO && (
          <Script
            src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
