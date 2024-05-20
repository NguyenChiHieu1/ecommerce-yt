const productCategoryModel = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const response = await productCategoryModel.create(req.body)
    return res.status(200).json({
        success: true,
        createdCategory: response ? response : "Cannot create new product-category"
    })
})

const getCategory = asyncHandler(async (req, res) => {
    const response = await productCategoryModel.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        prodCategories: response ? response : "Cannot get product-category"
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await productCategoryModel.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updateCategory: response ? response : "Cannot update product-category"
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await productCategoryModel.findByIdAndDelete(pcid)
    return res.status(200).json({
        success: response ? true : false,
        deleteCategory: response ? response : "Cannot delete product-category"
    })
})
module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}