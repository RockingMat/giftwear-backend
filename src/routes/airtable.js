"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const airtable_1 = __importDefault(require("airtable"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// Airtable configuration
const base = new airtable_1.default({ apiKey: process.env.AIRTABLE_API_KEY }).base('appOGVFN0HbzbUzbV');
const fetchAirtableRecords = (tableName, res) => {
    let allRecords = [];
    base(tableName)
        .select({
        view: 'Grid view',
    })
        .eachPage(function page(records, fetchNextPage) {
        allRecords = [...allRecords, ...records];
        fetchNextPage();
    }, function done(err) {
        if (err) {
            console.error(err);
            res.status(500).send(`Error fetching data from Airtable (${tableName})`);
        }
        else {
            res.json(allRecords);
        }
    });
};
router.get('/Upperwear', (req, res) => fetchAirtableRecords('New Upperwear', res));
router.get('/Lowerwear', (req, res) => fetchAirtableRecords('New Lowerwear', res));
router.get('/Footwear', (req, res) => fetchAirtableRecords('New Footwear', res));
router.get('/celebrities', (req, res) => fetchAirtableRecords('Celebrity', res));
exports.default = router;
