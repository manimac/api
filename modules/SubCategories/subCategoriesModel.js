const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const subCategorySchema = new Schema({
  parent_category: {
    type: String
  },
  name_english: {
    type: String
  },
  name_arabic: {
    type: String
  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  business: {
    type: Boolean
  },
  individual: {
    type: Boolean
  },
  active: {
    type: Boolean
  },
  sequence: {
    type: Number
  }
})

module.exports = SubCategory = mongoose.model('sub-category', subCategorySchema)