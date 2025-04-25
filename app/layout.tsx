import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import NavigationBar from "@/components/navigationbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "YUC - Charity Donation Platform",
  description: "A platform for charitable donations and support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-white`}>

        <NavigationBar />
        {children}

        <Toaster /> 

        <footer className="py-8 bg-gradient-to-br from-green-300 to-blue-300">
          <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
            ©️ 2025 YUC. Tüm hakları saklıdır.
          </div>
        </footer>
      </body>
    </html>
  );
}
