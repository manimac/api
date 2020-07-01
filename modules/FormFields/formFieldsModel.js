const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const formFieldsSchema = new Schema({
  application_name: {
    type: String
  },
  label: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String
  },
  sequence: {
    type: Number
  }
}
)

module.exports = FormFields = mongoose.model('formFields', formFieldsSchema)