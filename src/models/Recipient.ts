// src/models/Recipient.ts

import mongoose from 'mongoose';

const RecipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likedStyles: { type: [String], default: [] },
  preferredSizes: { type: [String], default: [] }, // Changed to array for multiple sizes
  picture: { type: String, default: null } // New optional field for profile picture
});

export default mongoose.model('Recipient', RecipientSchema);