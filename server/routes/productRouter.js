const router = require('express').Router()
const ctrls = require('../controllers/productController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createdProduct)
router.get('/', ctrls.getProducts)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
// : -> params, khoong can dang nhap, có param cho cuối cùng tránh nhầm / và /:pid
router.get('/:pid', ctrls.getProduct)



module.exports = router

//CRUD | Create - Read -Update -Delete | Post -GET -PUT -DELETE
// CREATE (POST) + PUT -body: data thg giấu đi
//GET + DELETE - query // ?