import express from 'express';
import userRouter from './userRoutes.js';

const alluserRoutes = express.Router();

alluserRoutes.use('/user', userRouter);

export default alluserRoutes;
