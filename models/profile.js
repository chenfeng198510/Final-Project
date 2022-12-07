const mongoose = require('mongoose');
const Order = require('./order');
const Schema = mongoose.Schema;
//productSchema code defines a property in the documents that will be added to the MongoDB database
const profileSchema = new Schema({
    user_id:{
        type: String,
        trim: true,
      },
    name: {
    type: String,
    ref:'user',
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
  city: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  birthday:{
    type: Date,
    trim:true,
  },
  occupation:{
    type: String,
    trim: true,
  },
  phone1:{
    type: Number,
    trim: true,
  },
  phone2:{
    type: Number,
    trim: true,
  },
  order: {
    type: Schema.Types.ObjectId,
      ref : 'Order'
    },

    petname:{
        type: String,
        trim: true,
      },

      pettype:{
        type: String,
        trim: true,
      },

    petimage:{
        type: String,
        trim: true,
      },

      petname2:{
        type: String,
        trim: true,
      },

      pettype2:{
        type: String,
        trim: true,
      },

    petimage2:{
        type: String,
        trim: true,
      },

      petname3:{
        type: String,
        trim: true,
        default:"Please Add Your Pet Information"
      },

      pettype3:{
        type: String,
        trim: true,
        default:"Other"
      },

    petimage3:{
        type: String,
        trim: true,
        default:"Please Add Your Pet Information"
      },

      petname4:{
        type: String,
        trim: true,
        default:"Please Add Your Pet Information"
      },

      pettype4:{
        type: String,
        trim: true,
        default:"Other"
      },

    petimage4:{
        type: String,
        trim: true,
        default:"Please Add Your Pet Information"
      },
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;