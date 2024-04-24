import { Router } from "express";
import {postStories,getStories,getNextStories} from '../controllers/stories.controller.js'
import auth from '../middlewares/auth.js'
const router=Router()
router.post('/postStories',auth,postStories)
router.post('/getStories',getStories)
router.post('/getNextStories',getNextStories)



export default router 