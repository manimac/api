const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  mobile: {
    type: Number,
    //required: true
  },
  email: {
    type: String,
    // required: true
  },
  password: {
    type: String
  },
  confirmPassword: {
    type: String
  },
  
})

module.exports = User = mongoose.model('users', UserSchema)