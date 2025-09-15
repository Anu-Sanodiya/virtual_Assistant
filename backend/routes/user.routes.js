const express = require('express');
const { getCurrentuser,UpdateAssistant } = require('../controllers/user.controller');
const isAuth  = require('../middlewares/isAuth');
const upload = require('../middlewares/multer')


const userRouter = express.Router();
userRouter.get('/current', isAuth, getCurrentuser);
userRouter.put('/update', isAuth, upload.single('assistantImage'), UpdateAssistant);
userRouter.post('/asktoassistant', isAuth, require('../controllers/user.controller').asktoAssistant);
module.exports = userRouter;
