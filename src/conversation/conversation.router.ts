import express from 'express'
import { authenticate } from '../auth/auth.controller'
import { validateSchema } from '../../utilities/utils'
import { conversationValidation } from './conversation.validation'
import { conversationController } from './conversation.controller'
import multer from 'multer'

const upload = multer({storage: multer.memoryStorage()})
const conversationRouter = express.Router()

conversationRouter.post('/create',authenticate,validateSchema(conversationValidation.create),upload.single('file'),conversationController.create)
conversationRouter.get('/list',authenticate,conversationController.list)
conversationRouter.delete('/remove',authenticate,conversationController.remove)
conversationRouter.patch('/update',authenticate,validateSchema(conversationValidation.update),upload.single('file'),conversationController.update)
conversationRouter.patch('/addAdmins',authenticate,conversationController.addAdmins)
conversationRouter.patch('/leave',authenticate,conversationController.leave)

export default conversationRouter


