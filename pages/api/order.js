import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const {
        fullName,
        email,
        phoneNumber,
        shippingAddress,
        cartItems,
        totalAmount,
        paymentMethod,
      } = req.body;

      // Transform cartItems: change each item's _id to productId and include size if available
      const formattedCartItems = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size, // include size if provided
      }));

      // Check if there's enough stock before placing the order and verify sizes if provided
      for (const item of formattedCartItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.name}`,
          });
        }

        // If a size is selected, verify it exists in the product's available sizes
        if (item.size && (!product.sizes || !product.sizes.includes(item.size))) {
          return res.status(400).json({
            success: false,
            message: `Selected size "${item.size}" is not available for product: ${item.name}`,
          });
        }

        if (product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${item.name}`,
          });
        }
      }

      // Create a new order using formattedCartItems
      const newOrder = new Order({
        fullName,
        email,
        phoneNumber,
        shippingAddress,
        cartItems: formattedCartItems,
        totalAmount,
        paymentMethod,
      });

      await newOrder.save();

      // Decrement the quantity of each product in the order
      await Promise.all(
        formattedCartItems.map(async (item) => {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { quantity: -item.quantity } }
          );
        })
      );

      res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        order: newOrder,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error placing order" });
    }
  } else if (req.method === "GET") {
    try {
      const orders = await Order.find();
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error fetching orders" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, newStatus } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status: newStatus },
        { new: true }
      );

      if (!updatedOrder) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      res.status(200).json({
        success: true,
        message: "Order status updated successfully!",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating order status",
        });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
