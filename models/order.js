const {Schema,model} = require('mongoose')

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
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
    createdAt:{ 
        type:Date,  
        default:Date.now
    }
})

const Order = model('Order',orderSchema)

module.exports = Order;
