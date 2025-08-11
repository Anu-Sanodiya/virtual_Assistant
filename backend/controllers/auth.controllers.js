
const User = require('../models/user.models');
const genToken = require('../config/token');

const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({
                success: false,
                message: "email already exists !"
            })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "password must be at least 8 characters! " })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newuser = await User.create({
            name,email, password: hashedPassword,
        })

        const token = await genToken(newuser._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })
        return res.status(201).json(newuser)


    } catch (error) {
        return res.status(500).json({ message: `sign up error ${error}` })
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email does not exists!" })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "incorect password !" })
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })
        return res.status(200).json(user)


    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message:"logout sucessfully ",
            sucess:true
        })
    } catch (error) {
        return res.status(500).json({ message: `logout errror ${error}` })
    }
}
module.exports = {signUp,logout, Login}