import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product"; // Assuming the Product model is defined
import ProductType from "@/lib/models/ProductType"; // Assuming the ProductType model is defined

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { category } = req.query;

  // Capitalize the category query parameter to ensure case-insensitive comparison
  const formattedCategory = category ? category.toString().toUpperCase() : null;

  try {
    if (formattedCategory) {
      // Step 1: Fetch the category ID from ProductType collection based on category name, case-insensitive
      const categoryType = await ProductType.findOne({
        name: { $regex: `^${formattedCategory}$`, $options: "i" }, // Case-insensitive search
      });

      if (!categoryType) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      // Step 2: Fetch products by the category ID (productType._id)
      const products = await Product.find({ "type": categoryType._id });

      return res.status(200).json({ success: true, products });
    }

    // Step 3: If no category, fetch all products (optional)
    const products = await Product.find();

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching products", error });
  }
}
