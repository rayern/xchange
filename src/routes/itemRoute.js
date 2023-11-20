import express from "express";
import { getAll, addNew } from '../controllers/ItemController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// router.use(authMiddleware);

router.get('/all/:startIdx', getAll);
// router.get('/:id', itemController.get);
router.post('/new', addNew);

export default router;
