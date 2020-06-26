const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const subCategorySchema = new Schema({
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

module.exports = SubCategory = mongoose.model('sub-category', subCategorySchema)