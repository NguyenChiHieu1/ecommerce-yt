const blogCategoryModel = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')

const createBlogCategory = asyncHandler(async (req, res) => {
    const response = await blogCategoryModel.create(req.body)
    return res.status(200).json({
        success: true,
        createdBlogCategory: response ? response : "Cannot create new  blog-category"
    })
})

const getBlogCategory = asyncHandler(async (req, res) => {
    const response = await blogCategoryModel.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        prodBlogCategories: response ? response : "Cannot get  blog-category"
    })
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await blogCategoryModel.findByIdAndUpdate(bcid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updateBlogCategory: response ? response : "Cannot update  blog-category"
    })
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await blogCategoryModel.findByIdAndDelete(bcid)
    return res.status(200).json({
        success: response ? true : false,
        deleteBlogCategory: response ? "Success delete blog-category" : "Cannot delete  blog-category"
    })
})
module.exports = {
    createBlogCategory,
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
}