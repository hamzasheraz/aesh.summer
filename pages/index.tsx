import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDisplay from "@/components/ProductDisplay";

export default function Home() {
  return (
    <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16 relative"
        >
          <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/img.jpg"
              alt="Golf memories"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
          </div>
          {/* Text on image */}
          <div className="absolute top-20 right-20">
            {" "}
            {/* Moved slightly left */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Button
                asChild
                size="lg" // Keep "lg" as it's the largest valid option
                className="text-2xl px-12 py-6 font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl active:scale-95"
              >
                <Link href="#featured-products">Shop Now</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Products Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          id="featured-products"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <ProductDisplay />
        </motion.div>
      </div>
    </section>
  );
}
