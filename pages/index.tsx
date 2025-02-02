import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductDisplay from "@/components/ProductDisplay"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"], weight: "700" })

export default function Home() {
  return (
    <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 mb-4">Welcome to Aesh.Summer</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover our collection of summer essentials that blend style and comfort for your perfect sunny days.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link href="#featured-products">Shop Now</Link>
          </Button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16"
        >
          <div className="relative w-full  h-[600px] md:h-[800px] overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/img.jpg"
              alt="Golf memories"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
            <div className="absolute top-2 right-40">
              <h2 className={`text-5xl md:text-6xl font-bold text-white tracking-wider ${playfair.className}`}>AESH</h2>
            </div>
          </div>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          id="featured-products"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <ProductDisplay />
        </motion.div>
      </div>
    </section>
  )
}
