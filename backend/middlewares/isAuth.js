const jwt = require('jsonwebtoken')


const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                message: "token not found"
            }
            )
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = verifyToken.userId
        next()
    } catch (err) {
        console.log("auth middleware error", err)
        return res.status(401).json({
            message: "Is auth error"
        })
    }
}
module.exports = { isAuth }