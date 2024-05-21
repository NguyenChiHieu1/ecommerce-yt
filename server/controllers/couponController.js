const couponModel = require('../models/couponModel')
const asyncHandler = require('express-async-handler')

const createNewCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body
    if (!name || !discount || !expiry) throw new Error('Missing inputs')

    const response = await couponModel.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000

    })
    return res.json({
        success: true,
        createdCoupon: response ? response : "Cannot create new coupon"
    })
})

const getCoupons = asyncHandler(async (req, res) => {
    const response = await couponModel.find().select('-createdAt -updatedAt')
    return res.json({
        success: response ? true : false,
        Coupons: response ? response : "Cannot get coupons"
    })
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { bid } = req.params
    // const { expiry } = req.body.expiry
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
    const response = await couponModel.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : "Cannot update coupon"
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await couponModel.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deleteCoupon: response ? "Success delete coupon" : "Cannot delete coupon"
    })
})
module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}