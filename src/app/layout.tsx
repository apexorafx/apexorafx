import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

export const metadata: Metadata = {
  title: "Apexora FX Hub",
  description: "Your gateway to global financial markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthContextProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
