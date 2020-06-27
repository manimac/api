const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const applicationViewSchema = new Schema({
  statusID: {
    type: String
  },
  applicationID: {
    type: String
  },
  comments: {
    type: String
  }
})

module.exports = ApplicationView = mongoose.model('applicationView', applicationViewSchema)