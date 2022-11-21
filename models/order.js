const mongoose = require('mongoose');
//productSchema code defines a property in the documents that will be added to the MongoDB database
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  price:{
    type: String,
    trim: true,
  },

  insurance: {
    type: Number,
},
  startday:{
    type: Date,
  },

  endday:{
    type: Date,
    
  },
  duration:{
    type:Number,
  },
  total: {
    type:Number,
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;