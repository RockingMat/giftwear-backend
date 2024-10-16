"use strict";
// src/routes/recipients.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Recipient_1 = __importDefault(require("../models/Recipient"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post('/create', authMiddleware_1.default, upload_1.default.single('headshot'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, gender, age, preferredSizes } = req.body;
        const newRecipient = new Recipient_1.default({
            name,
            gender,
            age: Number(age),
            preferredSizes: JSON.parse(preferredSizes),
            user: req.user.id,
        });
        const savedRecipient = yield newRecipient.save();
        res.json(savedRecipient); // This should include the _id
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}));
router.get('/list', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipients = yield Recipient_1.default.find({ user: req.user.id });
        res.json(recipients);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}));
// @route   GET api/recipients/:id
// @desc    Get a single recipient by ID
// @access  Private
router.get('/:id', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipient = yield Recipient_1.default.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }
        res.json(recipient);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}));
// src/routes/recipients.ts
// @route   DELETE api/recipients/:id
// @desc    Delete a recipient by ID
// @access  Private
router.delete('/:id', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipient = yield Recipient_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }
        res.json({ msg: 'Recipient deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}));
// @route   PUT api/recipients/:id/styles
// @desc    Add liked styles for a recipient
// @access  Private
router.put('/:id/styles', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { styles } = req.body;
        if (!Array.isArray(styles)) {
            return res.status(400).json({ msg: 'Styles must be an array' });
        }
        const recipient = yield Recipient_1.default.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }
        // Add new styles to the existing liked styles
        recipient.likedStyles = [...new Set([...recipient.likedStyles, ...styles])];
        yield recipient.save();
        res.json(recipient);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}));
// @route   POST api/recipients/:id/picture
// @desc    Upload a profile picture for a recipient
// @access  Private
router.post('/:id/picture', authMiddleware_1.default, upload_1.default.single('picture'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const recipient = yield Recipient_1.default.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }
        // Create a URL for the uploaded image
        const pictureUrl = `/uploads/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`; // Adjust this based on your server configuration
        recipient.picture = pictureUrl; // Update the recipient's picture field
        yield recipient.save();
        res.json(recipient);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}));
// @route   PUT api/recipients/update/:id
// @desc    Update a recipient by ID
// @access  Private
router.put('/update/:id', authMiddleware_1.default, upload_1.default.single('headshot'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, gender, age, preferredSizes } = req.body;
        const updateData = {
            name,
            gender,
            age: Number(age),
            preferredSizes: JSON.parse(preferredSizes),
        };
        // // Only update the picture if a new file is uploaded
        // if (req.file) {
        //   updateData.picture = `/uploads/${req.file.filename}`;
        // }
        const recipient = yield Recipient_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updateData, { new: true });
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }
        res.json(recipient);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
