import { Inter } from "next/font/google";
import { CartProvider } from "@/components/contexts/CartContext";
import { AuthProvider } from "@/components/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className={`${inter.className} antialiased`}>
          <Header />
          <main className="min-h-screen bg-white text-black flex flex-col">
            <Component {...pageProps} />
          </main>
          <Footer />
          <WhatsAppPopup />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
