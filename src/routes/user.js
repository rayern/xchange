import express from 'express'
import {signup, login, logout, profile, sendPasswordResetLink} from '../controllers/user.js'
import authMiddleware from "../middleware/auth.js"

const router = express.Router()

router.use(['/profile', '/logout'], authMiddleware)

router.post('/signup', signup)
router.post('/login', login)
router.post('/send-reset-password-link', sendPasswordResetLink)
router.get('/profile', profile)
router.get('/logout', logout)

export default router