import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], family: "Geist Sans", display: 'swap' });

export const metadata = {
  title: "AI-Ment Career Coach",
  description: "AI-Ment is an AI-powered student mentorship and learning dashboard designed to provide personalized academic support, progress tracking, and career guidance.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className}`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header />
            <main className="min-h-screen"> {children} </main>
            <Toaster richColors />
            {/* footer */}
            <footer className="bg-muted/50 py-8">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made by Ansh Parmar🤍</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
