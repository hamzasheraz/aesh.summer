"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/contexts/CartContext";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cartItems: cart,
          totalAmount,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order");
      } else {
        clearCart();
        router.push(`/thank-you?payment=${paymentMethod}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Error placing order. Please try again.");
      } else {
        alert("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
 <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center mb-4"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>PKR{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
          <div className="text-xl font-bold mt-4">
            Total: PKR{total.toFixed(2)}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Shipping Address"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                    paymentMethod === "cash"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                    paymentMethod === "online"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Online Payment
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {loading
                ? "Placing Order..."
                : paymentMethod === "cash"
                ? "Place Order (Cash on Delivery)"
                : "Place Order (Online Payment)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
