const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const staffSchema = new Schema({
  name: {
    type: String
  },
  mobile: {
    type: Number
  },
  email: {
    type: String
  },
  role: {
    type: Schema.Types.ObjectId, ref: 'roles'
  },
  password: {
    type: String
  }
})

module.exports = Staff = mongoose.model('staff', staffSchema)