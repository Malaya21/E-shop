const {Schema,model} = require('mongoose')

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, required: true },
  address: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const User = model('User',userSchema)

module.exports = User;
