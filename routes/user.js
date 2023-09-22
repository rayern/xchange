import express from 'express'
import {signup, login, logout} from '../controllers/user.js'
import authMiddleware from "./middleware/auth.js";

const router = express.Router()

app.use(['/profile', '/logout'], authMiddleware);

router.post('/signup', signup)
router.post('/login', login)
router.post('/profile', signup)
router.get('/logout', logout)

export default router