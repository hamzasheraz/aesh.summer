import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import ProductType from "@/lib/models/ProductType";
import multer from "multer";
import path from "path";

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads"); // Folder where images will be stored
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as the file name
      },
    }),
  }).single("image"); // The field name that contains the image

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); // Ensure DB connection

  switch (req.method) {
    case "POST":
      return addProduct(req, res);
    case "PUT":
      return editProduct(req, res);
    case "DELETE":
      return deleteProduct(req, res);
    case "GET":
      return getProducts(req, res);
    default:
      res.setHeader("Allow", ["POST", "PUT", "DELETE", "GET"]);
      return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

// ✅ ADD PRODUCT
const addProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Image upload failed", error: err });
        }
  
        const { name, price, quantity, type } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
        if (!name || !price || !quantity || !type || !imageUrl) {
          return res.status(400).json({ success: false, message: "All fields are required" });
        }
  
        try {
          const newProduct = new Product({
            name,
            price,
            quantity,
            type,
            image: imageUrl, // Store the image URL
          });
  
          await newProduct.save();
  
          return res.status(201).json({ success: true, product: newProduct });
        } catch (error) {
          return res.status(500).json({ success: false, message: "Failed to create product", error });
        }
      });
};

// ✅ EDIT PRODUCT
const editProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, name, price, quantity, typeId } = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if type exists
    const productType = await ProductType.findById(typeId);
    if (!productType) {
      return res.status(400).json({ success: false, message: "Invalid Product Type" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.type = typeId || product.type;

    await product.save();

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ DELETE PRODUCT
const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ GET ALL PRODUCTS
const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const products = await Product.find().populate("type", "name"); // Populate type name

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
