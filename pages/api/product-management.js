import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import ProductType from "@/lib/models/ProductType";

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser since Multer handles file uploads
  },
};

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
    const data = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          resolve(JSON.parse(body)); // Parse the incoming JSON
        } catch (error) {
          reject("Failed to parse body", error);
        }
      });
    });

    // Destructure and include sizes along with other fields.
    const { name, price, quantity, type, image, sizes } = data;

    // Ensure all required fields are provided
    if (!name || !price || !quantity || !type || !image || !sizes) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate that image is a valid URL
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlRegex.test(image)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image URL" });
    }

    // Create new product including sizes
    const newProduct = new Product({
      name,
      price: parseFloat(price), // Convert string to number
      quantity: parseInt(quantity), // Convert string to number
      type,
      image, // Store the image URL directly
      sizes, // Expecting an array of strings for sizes
    });

    // Save the product to the database
    await newProduct.save();

    // Populate the type field to include the type name
    const populatedProduct = await Product.findById(newProduct._id).populate(
      "type",
      "name"
    );

    // Return the populated product with type name
    return res
      .status(201)
      .json({ success: true, product: populatedProduct });
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
            reject("Failed to parse body", error);
          }
        });
      });

      // Destructure data including sizes if provided
      const { _id, name, price, quantity, type, image, sizes } = data;

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

      // Update the product fields. Only update if the field is provided.
      product.name = name || product.name;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
      product.type = type || product.type;

      // Handle image update (optional)
      if (image && image !== product.image) {
        // Here you could add logic to delete the old image if necessary
        product.image = image;
      }

      // Update sizes if provided. Expect sizes to be an array.
      if (sizes) {
        product.sizes = sizes;
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
            reject("Failed to parse body", error);
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
