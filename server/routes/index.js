const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const productCategoryRouter = require('./productCategoryRouter')
const blogCategoryRouter = require('./blogCategoryRouter')
const blogRouter = require('./blogRouter')
const { notFound, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/productCategory', productCategoryRouter)
    app.use('/api/blogCategory', blogCategoryRouter)
    app.use('/api/blog', blogRouter)


    app.use(notFound)
    //hứng các lỗi api trên để thk dưới hứng: nhờ thk asyncHandler
    app.use(errHandler)
}

module.exports = initRoutes