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
  owner:{
    type:String,
    default:'chenfeng198510@gmail.com',
  },

  ownerimage: {
    type: String,
    trim: true,
    default: 'https://www.dogtime.com/assets/uploads/2011/01/file_23012_beagle-460x290.jpg',
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;