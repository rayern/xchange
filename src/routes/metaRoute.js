import express from "express";
import { getAll, getByType } from '../controllers/metaController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// router.use(authMiddleware);

router.get('/enum', getAll);
router.get('/enum/:type', getByType);

export default router;
