"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const recipients_1 = __importDefault(require("./routes/recipients"));
const airtable_1 = __importDefault(require("./routes/airtable"));
const emails_1 = __importDefault(require("./routes/emails"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/recipients', recipients_1.default);
app.use('/api/airtable', airtable_1.default);
app.use('/api/emails', emails_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
