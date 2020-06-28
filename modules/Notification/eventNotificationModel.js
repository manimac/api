const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const eventNotificationSchema = new Schema({
  eventID: {
    type: Schema.Types.ObjectId, ref: 'events'
  },
  createdAt: {
    type: Date
  }
})

module.exports = EventNotification = mongoose.model('eventNotification', eventNotificationSchema)