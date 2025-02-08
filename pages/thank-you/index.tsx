import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("payment");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Thank You for Your Order!
        </h1>
        {paymentMethod === "cash" ? (
          <p className="text-xl text-gray-700 mb-8">
            Your summer essentials are on their way.
          </p>
        ) : (
            <p className="text-xl text-gray-700 mb-8">
              Click on the WhatsApp icon at bottom right to contact for payment gateway.
            </p>
        )}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 mt-6"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
