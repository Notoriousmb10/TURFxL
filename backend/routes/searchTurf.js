import express from 'express';
import { searchTurf } from '../controllers/handleTurfSearch.js';

const router = express.Router();

router.post('/searchTurfs', searchTurf);

export default router;