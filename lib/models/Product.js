import mongoose from "mongoose";

// Product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType", // Reference to the ProductType model
      required: true,
    },
    image: { type: String, required: true }, // The image URL or path
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
