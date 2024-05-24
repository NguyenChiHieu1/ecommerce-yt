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
    //lien quan kdl tham chieu, vd object lưu trong 1 ô bộ nhớ ram, dùng queries = {...req.query}
    //đều trỏ về cùng 1 ô chứa dữ liệu
    //destractory '...' sẽ copy dữ liệu nhưng 2 ô dữ liệu khác nhau
    // # const queries = req.query
    const queries = { ...req.query }
    //Tách các trường đặc biet ra khỏi query -> giups du lieu gui rut gon
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    //xóa truong khoi object queries
    excludeFields.forEach(el => delete queries[el])

    //Format lại các operators cho đúng cú pháp mongoose
    //toán tử từ client không có dấu $ nên giờ cần định dạng
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)

    //Filtering
    //học regex
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    //Không có await nên nó đang panding-chờ thêm đk lọc dưới
    let queryCommand = productModel.find(formatedQueries)


    //Filtering
    //acb,efg => {abc,efg} => abc efg
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)

    }

    //Pagination
    //limit: số object lấy về của api
    //skip: 2-----vd 1 2 3 4 .... 10 => bỏ qua 2 cái đầu tiên lấy 3 4 5..10
    //dấu + để auto chuyển kết quả string -> number
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    //Execute query
    //Số lượng sp thỏa mãn điều kiện != số lượng sp trả về 1 lần gọi API
    //------------------------------------------------error
    try {
        const products = await queryCommand.exec();
        const counts = await productModel.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: true,
            products,
            counts
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Cannot get products',
            error: err.message
        });
    }
    // .catch((err) => {
    //     console.error(err);
    // });
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

//rating
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const raitingProduct = await productModel.findById(pid)
    //chú ý el.postedBy kdl object != _id nên khi so sánh === nó khác nhau
    //function some return true/false//function find some return object đầu tiên
    const alreadyRating = raitingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
    // console.log({ alreadyRating });
    if (alreadyRating) {
        //update star & comment
        //update khong theo _id
        await productModel.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true })
    } else {
        // add star & comment
        //để ý cái rating luu trữ dạng mảng nên không dùng theo create đc mà cần púh
        await productModel.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true })
    }

    const updatedProduct = await productModel.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10

    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

//upload image products : last
const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.file) throw new Error("Missing input")
    const response = await productModel.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedProduct: response ? response : 'Cannot update image products'

    })
})
//the end -> 

module.exports = {
    createdProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}