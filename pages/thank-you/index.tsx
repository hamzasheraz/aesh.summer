import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    // Clear the cart here if needed
    // This assumes you have a clearCart function in your CartContext
    // If you don't, you'll need to implement it
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Thank You for Your Order!</h1>
        <p className="text-xl text-gray-700 mb-8">Your summer essentials are on their way.</p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

