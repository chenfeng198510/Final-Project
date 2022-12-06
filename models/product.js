const mongoose = require('mongoose');
//productSchema code defines a property in the documents that will be added to the MongoDB database
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required:true,
  },
  image: {
    type: String,
    trim: true,
    required:true,
  },
  address:{
    type: String,
    trim: true,
    required:true,
  },
  city:{
    type: String,
    trim: true,
    required:true,
  },

  price:{
    type:Number,
    required:true,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;