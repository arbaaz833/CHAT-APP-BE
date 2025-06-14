import express from 'express'
import { authenticate } from '../auth/auth.controller'
import { messageController } from './messages.controller'
import { validateSchema } from '../../utilities/utils'
import { messageValidation } from './messages.validation'
import multer from 'multer'

const upload = multer({storage: multer.memoryStorage()})
const messageRouter = express.Router()

messageRouter.get('/list/:id',authenticate,messageController.list)
messageRouter.post('/create/:id',authenticate,validateSchema(messageValidation.create,true),upload.array('files'),messageController.create)

export default messageRouter