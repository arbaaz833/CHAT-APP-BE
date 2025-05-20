import express from 'express'
import { authenticate } from '../auth/auth.controller'
import { messageController } from './messages.controller'
import { validateSchema } from '../../utilities/utils'
import { messageValidation } from './messages.validation'
const messageRouter = express.Router()

messageRouter.get('/list',authenticate,messageController.list)
messageRouter.post('/create',authenticate,validateSchema(messageValidation.create,true),messageController.create)

export default messageRouter