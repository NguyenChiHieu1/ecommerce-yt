const blogModel = require('../models/blogModel')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    if (!title || !description || !category) throw new Error('Missing inputs')
    const response = await blogModel.create(req.body)
    return res.status(200).json({
        success: true,
        createdBlog: response ? response : "Cannot create new blog"
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const response = await blogModel.find()
    return res.status(200).json({
        success: response ? true : false,
        prodBlogCategories: response ? response : "Cannot get blog"
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await blogModel.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updateBlog: response ? response : "Cannot update blog"
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await blogModel.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deleteBlog: response ? "Success delete blog" : "Cannot delete blog"
    })
})
//LIKE
//DISLIKE

// khi người dùng like một bài blog thì:
// 1. Check xem người dùng trước đó có dislike hay không?
// 2.Check xem ng đó trc đấy có like hay không? => bỏ like /thêm like
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) throw new Error('Missing inputs')
    const blog = await blogModel.findById(bid)
    const alreadyDisliked = blogModel?.dislikes?.find(el => el.toString() === _id)
    if (alreadyDisliked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if (isLiked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await blogModel.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params
    if (!bid) throw new Error('Missing inputs')
    const blog = await blogModel.findById(bid)
    const alreadyLiked = blogModel?.likes?.find(el => el.toString() === _id)
    if (alreadyLiked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if (isDisliked) {
        const response = await blogModel.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await blogModel.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await blogModel.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname')
    return res.status(200).json({
        success: blog ? true : false,
        rs: blog
    })
})

module.exports = {
    createNewBlog,
    getBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getBlog
}