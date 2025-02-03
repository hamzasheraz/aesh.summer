import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { capped: { size: 4096, max: 1 }, timestamps: true } // Ensures max 1 document
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
