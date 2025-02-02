// components/Layout.tsx (or pages/layout.tsx if you prefer)
"use client";
import { Inter } from "next/font/google";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aesh.Summer - Your Modern Summer Essentials",
  description:
    "Discover our collection of modern summer essentials that blend style and comfort for your perfect sunny days.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} antialiased`}>
      {/* You can move global styles to globals.css if preferred */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>

      <AuthProvider>
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-white text-black flex flex-col">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}
