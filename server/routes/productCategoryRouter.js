const router = require('express').Router()
const ctrls = require('../controllers/productCategoryController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategory)

router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)
module.exports = router

//CRUD | Create - Read -Update -Delete | Post -GET -PUT -DELETE
// CREATE (POST) + PUT -body: data thg giấu đi
//GET + DELETE - query // ?