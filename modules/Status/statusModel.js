const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const statusSchema = new Schema({
  status: {
    type: String
  }
})

module.exports = Status = mongoose.model('status', statusSchema)