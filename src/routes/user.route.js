import { Router } from "express";
import {login, logout, register,refreshToken,getUser,updateUser} from '../controllers/user.controller.js'
import upload from '../middlewares/multer.js'
import auth from '../middlewares/auth.js'
const router=Router()
router.post('/register',upload.single('avatar'),register)
router.post('/login',login)
router.get('/logout',auth,logout)
router.post('/refreshtoken',refreshToken)
router.post('/getUser',auth,getUser)
router.post('/updateUser',auth,updateUser)


export default router 