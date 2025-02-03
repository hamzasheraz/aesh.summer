import mongoose from 'mongoose';

const ContactUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  message: { type: String, required: true },
  phone: { type: String, required: false }, // Optional
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

export default mongoose.models.ContactUs || mongoose.model('ContactUs', ContactUsSchema);
