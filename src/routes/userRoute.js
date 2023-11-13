import express from 'express'
import {signup, login, logout, validateCode, sendPasswordResetLink, resetPassword} from '../controllers/userController.js'
import authMiddleware from "../middleware/auth.js"

const router = express.Router()

router.use(['/profile', '/logout'], authMiddleware)

router.post('/signup', signup)
router.post('/login', login)
router.post('/send-reset-password-link', sendPasswordResetLink)
router.post('/reset-password', resetPassword)
router.get('/validate-code/:code', validateCode)
router.get('/logout', logout)

export default router