import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb"; // Import MongoDB connection
import ProductType from "@/lib/models/ProductType"; // Ensure correct path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); // Connect to the database

  if (req.method === "POST") {
    try {
      const { name } = req.body;

      // Check if name is provided
      if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
      }

      // Check if product type already exists
      const existingType = await ProductType.findOne({ name });
      if (existingType) {
        return res.status(400).json({ success: false, message: "Product type already exists" });
      }

      // Create new product type
      const newProductType = await ProductType.create({ name });

      return res.status(201).json({ success: true, data: newProductType });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all product types
      const productTypes = await ProductType.find({}).sort({ createdAt: -1 });

      return res.status(200).json({ success: true, data: productTypes });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, newName } = req.body;

      // Check if ID and new name are provided
      if (!id || !newName) {
        return res.status(400).json({ success: false, message: "ID and new name are required" });
      }

      // Check if the product type exists
      const existingType = await ProductType.findById(id);
      if (!existingType) {
        return res.status(404).json({ success: false, message: "Product type not found" });
      }

      // Update the product type name
      existingType.name = newName;
      await existingType.save();

      return res.status(200).json({ success: true, data: existingType });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      // Check if ID is provided
      if (!id) {
        return res.status(400).json({ success: false, message: "ID is required" });
      }

      // Check if the product type exists
      const existingType = await ProductType.findById(id);
      if (!existingType) {
        return res.status(404).json({ success: false, message: "Product type not found" });
      }

      // Delete the product type
      await ProductType.findByIdAndDelete(id); 
      return res.status(200).json({ success: true, message: "Product type deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
