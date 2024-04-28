const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
}

//để cái next mới xài dc
//(error, req, res, next) Bắt buộc để hứng lỗi từ asyncHandler
const errHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        success: false,
        mes: error?.message
    })
}

module.exports = {
    notFound,
    errHandler
}

// công dụng chính là giúp rút gọn cái lỗi error khi mà code api có vấn đề, và để tránh hiện ra terminal