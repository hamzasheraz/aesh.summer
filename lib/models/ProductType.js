import mongoose from "mongoose";

const ProductTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProductType || mongoose.model("ProductType", ProductTypeSchema);
