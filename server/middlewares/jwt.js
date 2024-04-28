const jwt = require('jsonwebtoken')

// accesstoken: xác thực người dùng, phân quyền người dùng
const generateAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '2d' })
// refreshToken: cap mới accesstoken
const generateRefreshToken = (uid) => jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '7d' })

module.exports = {
    generateAccessToken,
    generateRefreshToken
}