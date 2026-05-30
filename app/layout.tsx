import type { Metadata } from "next";
import "./globals.css";
import { ThreeModelProvider } from "@/context/ThreeModelContext";
import ConditionalHeader from "@/components/ui/organisms/ConditionalHeader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import SignUpModal from "@/components/ui/molecules/SignUpModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  title: "MEMOÍ | Affordable Luxury for the Modern Woman",
  description: "Discover refined luxury with MEMOÍ. Explore our SS26 collection, \"The Becoming,\" and embrace an elegant lifestyle rooted in confidence, grace, and timeless design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative w-full h-full">
      <body className="relative" cz-shortcut-listen="true">
        <ReactQueryProvider>
          <CurrencyProvider>
            <ThreeModelProvider>
              <ConditionalHeader />
              {children}
              <SignUpModal />
              <ToastContainer position="top-right" autoClose={5000} />
            </ThreeModelProvider>
          </CurrencyProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
