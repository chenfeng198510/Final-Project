const mongoose = require('mongoose');
const Order = require('./order');
const Schema = mongoose.Schema;
//productSchema code defines a property in the documents that will be added to the MongoDB database
const userSchema = new Schema({
    user_id:{
        type: String,
        trim: true,
      },
    name: {
    type: String,
    trim: true,
  },
 nickName: {
    type: String,
    trim: true,
  },

  email:{
    type: String,
    trim: true,
  },
  picture:{
    type: String,
    trim: true,
  },
  order: {
    type: Schema.Types.ObjectId,
      ref : 'Order'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

