const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ResetPasswordSchema = new Schema({
  email: {
    type: String
  },
  oldPassword: {
    type: String
  },
  password: {
    type: String
  },
  confirmPassword: {
    type: String
  },
})

module.exports = ResetPassword = mongoose.model('resetPassword', ResetPasswordSchema)