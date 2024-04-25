const userModel = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        })
    const user = await userModel.findOne({ email: email })
    if (user) throw new Error("User has existed!")
    const newUser = await userModel.create(req.body)
    return res.status(200).json({
        sucess: newUser ? true : false,
        mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        })
    const response = await userModel.findOne({ email: email })
    // error1:
    // console.log(response.isCorrectPassword(password))
    //=======>>>> Promise { <pending> } 
    // isCorrectPassword chưa đc xử lý. nó đang chờ => bị bỏ qua => password nao no cung chay dc
    //=> dùng thêm await : đợi nó chạy xong đã
    if (response && await response.isCorrectPassword(password)) {
        //... detractoring: giảm bớt----js6
        // tách password và role khỏi response
        const { password, role, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const refreshToken = generateRefreshToken(response._id, role)
        //new: false => gửi data trc khi update
        // lưu refreshToken vào db
        await userModel.findByIdAndUpdate(response._id, { refreshToken }, { new: true })

        // lưu refresh token vào cookie
        // httpOnly: true : cho pheps ddau http  truy cap
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await userModel.findById({ _id }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: false,
        rs: user ? user : "User not found"
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //Lấy token từ cookie
    const cookie = req.cookies
    // console.log(cookie)
    //check có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //check token có hợp lệ hay không

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await userModel.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})
//logout ở client # gọi api phía server
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //xoas refreshToken trong DB
    await userModel.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //coas refreshToken trong cookie trinfh duyet
    // /, sameSite: 'None'
    res.clearCookie('refreshToken', { httpOnly: true, secure: true })
    return res.status(200).json({
        success: true,
        message: 'Logged is done'
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout
}