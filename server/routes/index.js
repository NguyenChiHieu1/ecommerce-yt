const userRouter = require('./userRouter')
const { notFound, errHandler } = require('../middlewares/errHandler')
const initRoutes = (app) => {
    app.use('/api/user', userRouter)


    app.use(notFound)
    //hứng các lỗi api trên để thk dưới hứng: nhờ thk asyncHandler
    app.use(errHandler)
}

module.exports = initRoutes