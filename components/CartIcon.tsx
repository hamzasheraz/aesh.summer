'use Client'
import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useCart } from "@/components/contexts/CartContext"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function CartIcon() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="relative">
      <button className="text-white hover:text-blue-300 transition" onClick={() => setIsOpen(!isOpen)}>
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-10"
          >
            {cart.length === 0 ? (
              <p className="text-center py-4 text-black">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center px-4 py-2">
                    <span className="font-semibold text-black">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => decreaseQuantity(item._id)} className="text-gray-500 hover:text-gray-700">
                        <Minus size={16} />
                      </button>
                      <span className="text-black">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="text-gray-500 hover:text-gray-700">
                        <Plus size={16} />
                      </button>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 ml-2">
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 px-4">
                  <p className="font-bold text-black">Total: ${total.toFixed(2)}</p>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 mt-2 hover:bg-blue-700 transition"
                >
                  Checkout
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

