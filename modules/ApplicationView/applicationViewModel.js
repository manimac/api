const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const applicationViewSchema = new Schema({
  statusID: {
    type: Schema.Types.ObjectId, ref: 'status'
  },
  applicationID: {
    type: Schema.Types.ObjectId, ref: 'applications'
  },
  comments: {
    type: String
  }
})

module.exports = ApplicationView = mongoose.model('applicationView', applicationViewSchema)