const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const categorySchema = new Schema({
  parent_category: {
    type: Schema.Types.ObjectId, ref: 'category'
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
  },
  sub_categories: {
    type: Array
  }
}
)

module.exports = Category = mongoose.model('category', categorySchema)