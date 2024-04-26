import { Router } from "express";
import {postStories,getStories,getNextStories,getStoryById,likeStory,bookmarkStory} from '../controllers/stories.controller.js'
import auth from '../middlewares/auth.js'
const router=Router()
router.post('/postStories',auth,postStories)
router.post('/getStories',getStories)
router.post('/getNextStories',getNextStories)
router.get('/getStory/:id',getStoryById)
router.post('/likeStory/:id',auth,likeStory)
router.post('/bookmarkStory/:id',auth,bookmarkStory)



export default router 