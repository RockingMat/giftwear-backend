// src/routes/recipients.ts

import express from 'express';
import { Response } from 'express';
import Recipient from '../models/Recipient';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router = express.Router();

// @route   POST api/recipients
// @desc    Create a new recipient
// @access  Private
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, gender, age, preferredSizes } = req.body;
    const newRecipient = new Recipient({
      name,
      gender,
      age,
      preferredSizes,
      user: req.user!.id
    });

    const recipient = await newRecipient.save();
    res.json({ recipient: { id: recipient._id, name: recipient.name } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/list', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const recipients = await Recipient.find({ user: req.user!.id });
      res.json(recipients);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

 
// @route   GET api/recipients/:id
// @desc    Get a single recipient by ID
// @access  Private
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const recipient = await Recipient.findOne({ 
      _id: req.params.id, 
      user: req.user!.id 
    });

    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }

    res.json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// src/routes/recipients.ts

// @route   DELETE api/recipients/:id
// @desc    Delete a recipient by ID
// @access  Private
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const recipient = await Recipient.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user!.id 
    });

    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }

    res.json({ msg: 'Recipient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipients/:id/styles
// @desc    Add liked styles for a recipient
// @access  Private
router.put('/:id/styles', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { styles } = req.body;

    if (!Array.isArray(styles)) {
      return res.status(400).json({ msg: 'Styles must be an array' });
    }

    const recipient = await Recipient.findOne({ 
      _id: req.params.id, 
      user: req.user!.id 
    });

    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }

    // Add new styles to the existing liked styles
    recipient.likedStyles = [...new Set([...recipient.likedStyles, ...styles])];

    await recipient.save();

    res.json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/recipients/:id/picture
// @desc    Upload a profile picture for a recipient
// @access  Private
router.post('/:id/picture', authMiddleware, upload.single('picture'), async (req: AuthRequest, res: Response) => {
  try {
    const recipient = await Recipient.findOne({ 
      _id: req.params.id, 
      user: req.user!.id 
    });

    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }

    // Create a URL for the uploaded image
    const pictureUrl = `/uploads/${req.file?.filename}`; // Adjust this based on your server configuration

    recipient.picture = pictureUrl; // Update the recipient's picture field
    await recipient.save();

    res.json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/recipients/update/:id
// @desc    Update a recipient by ID
// @access  Private
router.put('/update/:id', async (req, res) => {
  try {
    const recipient = await Recipient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }
    res.json(recipient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
export default router;