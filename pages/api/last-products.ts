// pages/api/products/getLast6Products.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/lib/models/Product'; // Adjust with your actual model path
import { connectDB } from '@/lib/mongodb';

const getLast6Products = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    // Fetch the last 6 products, sorted by creation date
    const products = await Product.find()
      .sort({ createdAt: -1 })  // Sort by newest first
      .limit(6);  // Limit to 6 products

    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export default getLast6Products;
