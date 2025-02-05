"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/components/contexts/CartContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, removeFromCart, cart, increaseQuantity, decreaseQuantity } = useCart();

  useEffect(() => {
    // Fetch last 6 products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/last-products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const closeModal = () => setSelectedProduct(null);

  const getItemQuantity = (id) => {
    const item = cart.find((item) => item._id === id);
    return item ? item.quantity : 0;
  };

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
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
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
                  {getItemQuantity(selectedProduct._id) > 0 ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => decreaseQuantity(selectedProduct._id)}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-xl font-semibold">{getItemQuantity(selectedProduct._id)}</span>
                      <button
                        onClick={() => increaseQuantity(selectedProduct._id)}
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
                  {getItemQuantity(selectedProduct._id) > 0 && (
                    <button
                      onClick={() => removeFromCart(selectedProduct._id)}
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
  );
}
