const orderModel = require('../models/orderModel')
const userModel = require('../models/userModel')
const couponModel = require('../models/couponModel')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon } = req.body
    const userCart = await userModel.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }))
    let total = userCart?.cart?.reduce((sum, el) => el.product.price * el.quantity + sum, 0)
    const createData = { products, total, orderBy: _id }
    if (coupon) {
        const selectedCoupon = await couponModel.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon?.discount / 100) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }

    const rs = await orderModel.create(createData)
    res.status(200).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong',
        userCart
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status')
    const response = await orderModel.findByIdAndUpdate(oid, { status }, { new: true })
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    // const { status } = req.body
    // if (!status) throw new Error('Missing status')
    const response = await orderModel.find({ orderBy: _id })
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

const getAllOrder = asyncHandler(async (req, res) => {
    // const { oid } = req.params
    // const { status } = req.body
    // if (!status) throw new Error('Missing status')
    const response = await orderModel.find()
    res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getAllOrder
}