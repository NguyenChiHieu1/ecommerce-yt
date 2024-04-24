const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    isBlock: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        // luu db: so sanh khi muốn đổi token khi hét hạn; nếu cái này ko đúng| quá hạn =>  đăng nhập lại
    },
    passwordChangeAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    //arrow function KHÔNG dùng đc ở đây(xung đột giá trị this)
    isCorrectPassword: async function (password) {
        //compare giup so sanh hash->pass dung >< pass mới
        //return true || false
        return await bcrypt.compare(password, this.password)
    }
}
//Export the model
module.exports = mongoose.model('User', userSchema); 