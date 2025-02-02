import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductDisplay from "@/components/ProductDisplay"

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

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16"
        >
          <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Summer collection"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4">
                Embrace the Summer Vibes
              </h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-blue-100 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Quality Materials</h3>
            <p>Our products are made with the finest materials for lasting comfort and style.</p>
          </div>
          <div className="bg-purple-100 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Trendy Designs</h3>
            <p>Stay fashionable with our latest summer trends and unique designs.</p>
          </div>
          <div className="bg-green-100 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Eco-Friendly</h3>
            <p>We're committed to sustainable practices and eco-friendly materials.</p>
          </div>
        </motion.div>

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

