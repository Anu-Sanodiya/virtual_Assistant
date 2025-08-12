const express = require('express');
const { getCurrentuser,UpdateAssistant } = require('../controllers/user.controller');
const isAuth  = require('../middlewares/isAuth');
const upload = require('../middlewares/multer')
const { signUp, Login } = require('../controllers/auth.controllers');

const userRouter = express.Router();
userRouter.post('/signup', signUp);
userRouter.post('/login', Login);

module.exports = userRouter;
