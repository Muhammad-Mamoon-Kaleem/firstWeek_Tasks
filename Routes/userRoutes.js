import express from 'express'
import { changePassword, createUser, loginUser } from '../Controllers/userController.js';
import multer from 'multer';
import {   verifyConfirmationForChangePass, verifyConfirmationForNewAccount } from '../MiddleWares/confirmationMiddleware.js';
const userRouter = express.Router();
const midlleware = multer();
userRouter.post('/createuser',midlleware.none(),createUser)
userRouter.post('/verifyandcreate',midlleware.none(), verifyConfirmationForNewAccount)
userRouter.post('/loginuser',midlleware.none(),loginUser)
userRouter.post('/changepassword',midlleware.none(),changePassword)
userRouter.post('/verifyandchangepassword',midlleware.none(),verifyConfirmationForChangePass)
export default userRouter;