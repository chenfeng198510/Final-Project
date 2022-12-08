const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
//productSchema code defines a property in the documents that will be added to the MongoDB database
const orderSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  image:{
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

  startdate1:{
    type: String,
    default: function() {
  
      var dateObj = new Date(this.startdate);
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      
      startdate1 = year + "/" + month + "/" + day;
      return startdate1
    }
  },

  enddate:{
    type: Date,
    required:true,
  },

  enddate1:{
    type: String,
    default: function() {
  
      var dateObj = new Date(this.enddate);
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      
      enddate1 = year + "/" + month + "/" + day;
      return enddate1
    }
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