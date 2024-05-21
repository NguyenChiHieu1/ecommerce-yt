const router = require('express').Router()
const ctrls = require('../controllers/couponController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewCoupon)
router.get('/', ctrls.getCoupons)

router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)
module.exports = router