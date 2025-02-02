import { motion } from "framer-motion"
import Image from "next/image"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        About Aesh.Summer
      </motion.h1>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Aesh.Summer Team"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Aesh.Summer was born out of a passion for creating the perfect summer experience. Our founders, avid
            beach-goers and sun enthusiasts, realized that finding high-quality, stylish summer essentials was often a
            challenge.
          </p>
          <p className="text-gray-700 mb-4">
            We set out to create a brand that embodies the spirit of summer - fun, relaxed, and effortlessly cool. Each
            product in our collection is carefully designed and selected to enhance your summer adventures, whether
            you're lounging by the pool, hitting the beach, or exploring a new sunny destination.
          </p>
          <p className="text-gray-700">
            At Aesh.Summer, we believe that the right gear can transform your summer experience. We're committed to
            providing you with products that not only look great but also stand up to the rigors of sun, sand, and surf.
            Join us in celebrating the season of endless sunshine and unforgettable memories.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

