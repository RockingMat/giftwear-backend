import express from 'express';
import Airtable from 'airtable';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Airtable configuration
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appOGVFN0HbzbUzbV');

const fetchAirtableRecords = (tableName: string, res: express.Response) => {
  let allRecords: any[] = [];

  base(tableName)
    .select({
      view: 'Grid view',
    })
    .eachPage(
      function page(records, fetchNextPage) {
        allRecords = [...allRecords, ...records];
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          res.status(500).send(`Error fetching data from Airtable (${tableName})`);
        } else {
          res.json(allRecords);
        }
      }
    );
};

router.get('/Upperwear', (req, res) => fetchAirtableRecords('New Upperwear', res));
router.get('/Lowerwear', (req, res) => fetchAirtableRecords('New Lowerwear', res));
router.get('/Footwear', (req, res) => fetchAirtableRecords('New Footwear', res));
router.get('/celebrities', (req, res) => fetchAirtableRecords('Celebrity', res));

export default router;