import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import ProductType from "@/lib/models/ProductType";
import multer from "multer";
import path from "path";
import { promisify } from "util";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser since Multer handles file uploads
  },
};

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).single("image");
const uploadMiddleware = promisify(upload);

// API route handler
export default async function handler(req, res) {
  await connectDB();

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
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    // Handle file upload
    await uploadMiddleware(req, res);

    const { name, price, quantity, type } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Ensure all required fields are provided
    if (!name || !price || !quantity || !type || !imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Create new product
    const newProduct = new Product({
      name,
      price: parseFloat(price), // Convert string to number
      quantity: parseInt(quantity), // Convert string to number
      type,
      image: imageUrl,
    });

    // Save the product to the database
    await newProduct.save();

    // Populate the type field to include the type name
    const populatedProduct = await Product.findById(newProduct._id).populate(
      "type",
      "name"
    );

    // Return the populated product with type name
    return res.status(201).json({ success: true, product: populatedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create product" });
  }
};

// EDIT PRODUCT
const editProduct = async (req, res) => {
  if (req.method === "PUT") {
    try {
      // Parse the request body manually
      const data = await new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            resolve(JSON.parse(body)); // Parse the incoming JSON
          } catch (error) {
            reject("Failed to parse body",error);
          }
        });
      });

      const { _id, name, price, quantity, type } = data;

      if (!_id) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      // Find the product by ID
      const product = await Product.findById(_id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Validate type if provided
      if (type) {
        const productType = await ProductType.findById(type);
        if (!productType) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid Product Type" });
        }
      }

      // Update the product fields
      product.name = name || product.name;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
      product.type = type || product.type;

      // Handle image update (optional)
      if (data.image && data.image !== product.image) {
        // Delete old image if new one is uploaded
        if (product.image) {
          const imagePath = path.join(process.cwd(), "public", product.image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log("Image deleted successfully:", imagePath);
            }
          });
        }
        // Update the product image path
        product.image = data.image;
      }

      // Save the updated product
      await product.save();

      // Optionally, populate the `type` field to return its name
      const updatedProduct = await Product.findById(product._id).populate(
        "type",
        "name"
      );

      return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
      console.error("Error editing product:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const data = await new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            resolve(JSON.parse(body)); // Parse the incoming JSON
          } catch (error) {
            reject("Failed to parse body",error);
          }
        });
      });

      const { id } = data;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      // Find the product by ID
      const product = await Product.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Delete the image file if it exists
      if (product.image) {
        const imagePath = path.join(process.cwd(), "public", product.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          } else {
            console.log("Image deleted successfully:", imagePath);
          }
        });
      }

      // Delete the product
      await Product.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ success: true, message: "Product deleted" });
    } catch (error) {
      console.error("Server Error:", error); // Log error for debugging
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("type", "name");
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Server Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
