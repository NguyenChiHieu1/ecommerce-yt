const brandModel = require('../models/brandModel')
const asyncHandler = require('express-async-handler')

const createNewBrand = asyncHandler(async (req, res) => {
    const response = await brandModel.create(req.body)
    return res.json({
        success: true,
        createdBrand: response ? response : "Cannot create new brand"
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const response = await brandModel.find()
    return res.json({
        success: response ? true : false,
        brands: response ? response : "Cannot get brand"
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await brandModel.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : "Cannot update brand"
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await brandModel.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deleteBrand: response ? "Success delete brand" : "Cannot delete brand"
    })
})
module.exports = {
    createNewBrand,
    getBrands,
    updateBrand,
    deleteBrand
}