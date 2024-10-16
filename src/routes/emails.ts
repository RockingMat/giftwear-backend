import express from 'express';
import { addEmail } from '../controllers/emailController';

const router = express.Router();

router.post('/add', addEmail);

export default router;
