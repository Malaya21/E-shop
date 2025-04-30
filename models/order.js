const {Schema,model} = require('mongoose')

const orderSchema = new Schema({
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
        required:true
    },
    status:{
        type:String,
        enum:['pending','confirmed','shipped','delivered','cancelled'],
        default:'pending'
    },
    paymentMode:{
        type:String,
        default:'cod'
    },
    address:{
        type:String,
        required:true
    }    ,
    createdAt:{ 
        type:Date,  
        default:Date.now
    }
})

const Order = model('Order',orderSchema)

module.exports = Order;
