const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    //chuoi token: Bearer sdfherfgh.lwerghrtlgdfsguruseg
    //headers: { authorization: Bearer string_token }
    //startsWith: bắt đầu với bears
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        //laays ptu thu 2
        const token = req.headers.authorization.split(' ')[1]
        //kiem tra token giong
        //verify lỗi -> err != null, ko xác thực
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                mes: 'Invalid access token'
            })
            console.log(decode);
            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Require authenrication!!!'
        })
    }
})

module.exports = {
    verifyAccessToken
}