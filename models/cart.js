const {Schema,model} = require('mongoose')

const cartSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        price:{
            type:Number,
            required:true,
            set: v => Math.round(v * 100) / 100 // only accept 2 decimal places
        },
       
    }],
    totalAmount:{
        type:Number,
        required:true,
        default:0,
        set: v => Math.round(v * 100) / 100 // only accept 2 decimal places
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
  
})

const Cart = model('Cart', cartSchema)

module.exports = Cart;
