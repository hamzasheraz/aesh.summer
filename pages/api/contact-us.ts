import type { NextApiRequest, NextApiResponse } from 'next';
import ContactUs from '@/lib/models/ContactUs';  // Import the schema
import { connectDB } from '@/lib/mongodb';  // Import MongoDB connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectDB();

      const { name, email, message, phone } = req.body;

      // Create a new contact form entry
      const newContact = new ContactUs({
        name,
        email,
        message,
        phone
      });

      // Save it to the database
      await newContact.save();

      return res.status(201).json({ message: 'Message received successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error while submitting message.' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
