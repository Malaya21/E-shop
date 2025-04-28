const {Schema,model} = require('mongoose')

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String ,enum:['electronics','clothing','books','other']},
    stock: { type: Number, required: true },
    image: { type: String }, // URL to image
    createdAt: { type: Date, default: Date.now }
  
})  

const Product = model('Product',productSchema)

module.exports = Product;
