const router = require('express').Router()
const ctrls = require('../controllers/blogController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.get('/', ctrls.getBlogs)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get('/one/:bid', ctrls.getBlog)
router.put('/likes/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislikes/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router

//CRUD | Create - Read -Update -Delete | Post -GET -PUT -DELETE
// CREATE (POST) + PUT -body: data thg giấu đi
//GET + DELETE - query // ?