const jwt = require('jsonwebtoken')

// accesstoken: xác thực người dùng, phân quyền người dùng
const generateAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '15s' })
// refreshToken: cap mới accesstoken
const generateRefreshToken = (uid, role) => jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '60s' })

module.exports = {
    generateAccessToken,
    generateRefreshToken
}