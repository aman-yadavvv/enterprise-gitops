import express from 'express'
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updatePassword,
  logout 
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validateRegister, validateLogin } from '../middleware/validation.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.patch('/updateprofile', protect, updateProfile)
router.patch('/updatepassword', protect, updatePassword)

export default router