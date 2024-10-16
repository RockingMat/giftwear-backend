"use strict";
// src/models/Recipient.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RecipientSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    likedStyles: { type: [String], default: [] },
    preferredSizes: { type: [String], default: [] }, // Changed to array for multiple sizes
    picture: { type: String, default: null } // New optional field for profile picture
});
exports.default = mongoose_1.default.model('Recipient', RecipientSchema);
