import express from "express";
import { getAll, addNew } from '../controllers/itemController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(['/new'], authMiddleware)

router.get('/all/:startIdx', getAll);
router.post('/new', addNew);
router.patch('/update/:itemId', addNew);

export default router;
