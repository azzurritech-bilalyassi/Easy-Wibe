const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  title:{
    type:String
  },

  message:{
    type:String
  },

  eventId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Event"
  },

  isRead:{
    type:Boolean,
    default:false
  }

},{timestamps:true});

module.exports = mongoose.model("Notification",NotificationSchema);