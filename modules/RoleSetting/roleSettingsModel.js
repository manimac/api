const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const roleSchema = new Schema({
  name: {
    type: String
  }
})

module.exports = Role = mongoose.model('role', roleSchema)