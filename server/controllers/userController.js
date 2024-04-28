const userModel = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !firstname || !lastname || !mobile)
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
        const { password, role, refreshToken, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        //new: false => gửi data trc khi update
        // lưu refreshToken vào db
        await userModel.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })

        // lưu refresh token vào cookie
        // httpOnly: true : cho pheps ddau http  truy cap
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

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
        success: user ? true : false,
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

// reset password
//client gửi email
//Server check email có hợp lệ hay không => gửi email + kèm theo link (pasword change token)
//Client check email => Click link đã gửi email
//Client gửi api kèm token
//check token giống với token mà server gửi email không
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email')
    const user = await userModel.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    // lưu ... vào db rồi giwof gửi email.
    //Bảo mật 2 lớp bằng ddienj thoại

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

    const data = {
        email: email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing password or token')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await userModel.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })

})

const getUser = asyncHandler(async (req, res) => {
    const response = await userModel.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await userModel.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} delete` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await userModel.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Some thing went wrong'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await userModel.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Some thing went wrong'
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUser,
    deleteUser,
    updateUser,
    updateUserByAdmin
}