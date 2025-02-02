"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../../components/contexts/CartContext"

export default function Checkout() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Order placed:", { cart, customerDetails: formData })
    clearCart()
    router.push("/thank-you")
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Shipping Address"
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

