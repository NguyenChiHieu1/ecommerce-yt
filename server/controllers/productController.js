const productModel = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createdProduct = asyncHandler(async (req, res) => {
    //kiem tra du lieu body co khong, không ktr true/false cho object hay array dc vì đều false
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await productModel.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await productModel.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})
//Filtering, sorting & padination
const getProducts = asyncHandler(async (req, res) => {
    const product = await productModel.find()
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get products'
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await productModel.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updateProduct ? true : false,
        updateProduct: updateProduct ? updateProduct : 'Cannot update products'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProduct = await productModel.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct ? deleteProduct : 'Cannot delete products'
    })
})
module.exports = {
    createdProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}