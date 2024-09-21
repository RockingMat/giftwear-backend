// src/routes/recipients.ts

import express from 'express';
import { Response } from 'express';
import Recipient from '../models/Recipient';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST api/recipients
// @desc    Create a new recipient
// @access  Private
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, gender, age } = req.body;
    const newRecipient = new Recipient({
      name,
      gender,
      age,
      user: req.user!.id
    });

    const recipient = await newRecipient.save();
    res.json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const recipients = await Recipient.find({ user: req.user!.id });
      res.json(recipients);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

export default router;