const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const formFieldsSchema = new Schema({
  label: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String
  }
}
)

module.exports = FormFields = mongoose.model('formFields', formFieldsSchema)