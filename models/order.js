const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
//productSchema code defines a property in the documents that will be added to the MongoDB database
const orderSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  price:{
    type: Number,
    trim: true,
  },

  insurance: {
    type: Number,
    required:true,
},
  startdate:{
    type: Date,
    required:true,
  },

  enddate:{
    type: Date,
    required:true,
  },
  
  duration:{
    type:Number,
    default: function() {
      var date1 = new Date(this.startdate);
      var date2 = date1.getTime();
      var date3 = new Date(this.enddate);
      var date4 = date3.getTime();
      var difference= Math.abs((date4 - date2) / (1000 * 3600 * 24));
      return difference
    }
},

  total: {
    type:Number,
    default: function() {
      var t = (this.price + this.insurance) * this.duration;
      var total =t.toFixed(2);

      return total
    }
    },

GST: {
  type:Number,
  default: function() {
    var gst =(0.07*this.total).toFixed(2);

    return gst
  }
},

PST:{
  type:Number,
  default: function() {
    var pst = (0.05*this.total).toFixed(2);

    return pst
  }
},

totalaftax:{
  type:Number,
  default: function() {
    var totalaftax = (this.total + this.GST + this.PST).toFixed(2);

    return totalaftax
  }
},

user: {
      type: String,
      ref : 'User'
},

status: {
  type:String,
  default:'Pending',
}  
});




const Order = mongoose.model('Order', orderSchema);
module.exports = Order;