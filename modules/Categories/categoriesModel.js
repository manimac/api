const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const categorySchema = new Schema({
  parent_category: {
    type: String
  },
  name: {
    type: String
  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  active: {
    type: Boolean
  },
  sequence: {
    type: Number
  }
})

module.exports = Category = mongoose.model('category', categorySchema)