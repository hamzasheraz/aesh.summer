"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/components/contexts/CartContext"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Summer Dress",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "A light and breezy summer dress perfect for hot days.",
  },
  {
    id: 2,
    name: "Beach Hat",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Stylish and protective beach hat to shield you from the sun.",
  },
  {
    id: 3,
    name: "Sunglasses",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "UV-protective sunglasses with a modern design.",
  },
  {
    id: 4,
    name: "Sandals",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Comfortable and durable sandals for beach and casual wear.",
  },
  {
    id: 5,
    name: "Beach Towel",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Large, soft beach towel with a vibrant summer pattern.",
  },
  {
    id: 6,
    name: "Swimsuit",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Flattering and comfortable swimsuit for all your water activities.",
  },
]

export default function ProductDisplay() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const { addToCart, removeFromCart, cart, increaseQuantity, decreaseQuantity } = useCart()

  const closeModal = () => setSelectedProduct(null)

  const getItemQuantity = (id: number) => {
    const item = cart.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 border border-gray-200 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative h-64">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} layout="fill" objectFit="cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  width={300}
                  height={300}
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                <p className="text-blue-600 font-bold text-xl mb-4">${selectedProduct.price.toFixed(2)}</p>
                <div className="space-y-4">
                  {getItemQuantity(selectedProduct.id) > 0 ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => decreaseQuantity(selectedProduct.id)}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-xl font-semibold">{getItemQuantity(selectedProduct.id)}</span>
                      <button
                        onClick={() => increaseQuantity(selectedProduct.id)}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart({ ...selectedProduct, quantity: 1 })}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  )}
                  {getItemQuantity(selectedProduct.id) > 0 && (
                    <button
                      onClick={() => removeFromCart(selectedProduct.id)}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                    >
                      Remove from Cart
                    </button>
                  )}
                  <Link
                    href="/checkout"
                    className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

