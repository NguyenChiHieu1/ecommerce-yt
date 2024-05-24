const router = require('express').Router()
const ctrls = require('../controllers/productController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createdProduct)
router.get('/', ctrls.getProducts)
router.put('/ratings', verifyAccessToken, ctrls.ratings)

// up 1 ảnh
// router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImagesProduct)
//up nhieu ảnh, tối đa 10
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImagesProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)

router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
// : -> params, khoong can dang nhap, có param cho cuối cùng tránh nhầm / và /:pid
router.get('/:pid', ctrls.getProduct)



module.exports = router

//CRUD | Create - Read -Update -Delete | Post -GET -PUT -DELETE
// CREATE (POST) + PUT -body: data thg giấu đi
//GET + DELETE - query // ?