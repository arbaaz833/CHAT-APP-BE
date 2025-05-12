import express from 'express'
import { authenticate } from '../auth/auth.controller'
import { validateSchema } from '../../utilities/utils'
import { conversationValidation } from './conversation.validation'
import { upload } from '../../app'
const router = express.Router()

router.post('/',authenticate,validateSchema(conversationValidation.create),upload.single('file'),)