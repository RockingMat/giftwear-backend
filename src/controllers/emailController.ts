import { Request, Response } from 'express';
import Email from '../models/Email';

export const addEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const newEmail = new Email({ email });
    await newEmail.save();

    res.status(201).json({ message: 'Email added successfully', email: newEmail });
  } catch (error) {
    console.error('Error adding email:', error);
    res.status(500).json({ message: 'Error adding email' });
  }
};
