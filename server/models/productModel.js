// {!mdbgum}
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    // tên sp
    title: {
        type: String,
        required: true,
        //tự động bỏ dấu cách hai đầu
        trim: true
    },
    //đường dẫn đến sp: tạo từ tên sp, bỏ dấu dùng áo polo: ao_polo
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    //mô tả sp
    description: {
        type: String,
        required: true
    },
    //nhãn hiệu, công ty, nhà sản xuất
    brand: {
        type: String,
        required: true,
    },
    //giá tiền
    price: {
        type: Number,
        required: true,
    },
    //danh mục sp
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    //số lượng sp
    quantity: {
        type: Number,
        default: 0
    },
    //số mặt hàng bán
    sold: {
        type: Number,
        default: 0
    },
    //ảnh mặt hàng. link ảnh
    images: {
        type: Array,
    },
    // màu sắc
    color: {
        type: String,
        // chỉ nằm trong giá trị cho trc
        enum: ['Black', 'Grown', 'Red'],
    },
    //đanh giá
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }
        }
    ],
    //lượng ng vote
    totalRatings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);