const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const eventsSchema = new Schema({
  file_upload: {
    type: String
  },
  comments: {
    type: String
  }
})

module.exports = Events = mongoose.model('events', eventsSchema)