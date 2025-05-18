import express from 'express'
import { authenticate } from '../auth/auth.controller'
import { validateSchema } from '../../utilities/utils'
import { conversationValidation } from './conversation.validation'
import { upload } from '../../app'
import { conversationController } from './conversation.controller'
const router = express.Router()

router.post('/',authenticate,validateSchema(conversationValidation.create),upload.single('file'),conversationController.create)
router.get('/list',authenticate,conversationController.list)
router.delete('/remove',authenticate,conversationController.remove)
router.patch('/update',authenticate,conversationController.update)