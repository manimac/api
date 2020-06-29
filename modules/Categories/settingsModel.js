const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const settingsSchema = new Schema({
  image: {
    type: String
  }
}
)

module.exports = Settings = mongoose.model('settings', settingsSchema)