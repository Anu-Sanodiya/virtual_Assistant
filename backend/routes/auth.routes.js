const express =require('express')
const { signUp, logout, Login } = require('../controllers/auth.controllers');

const authRouter =express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", Login)
authRouter.get("/logout", logout)
module.exports = authRouter;


