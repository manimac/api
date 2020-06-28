const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const applicationNotificationSchema = new Schema({
  applicationID: {
    type: Schema.Types.ObjectId, ref: 'application'
  },
  userID: {
    type: Schema.Types.ObjectId, ref: 'users'
  },
  createdAt: {
    type: Date
  }
})

module.exports = ApplicationNotification = mongoose.model('applicationNotification', applicationNotificationSchema)