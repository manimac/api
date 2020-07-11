const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const applicationSchema = new Schema({
  applicationName: {
    type: String,
  },
  userID: {
    type: Schema.Types.ObjectId, ref: 'users'
  },
  categoryID: {
    type: Schema.Types.ObjectId, ref: 'category'
  },
  subCategoryID: {
    type: Schema.Types.ObjectId, ref: 'category'
  },
  licensing_location: {
    type: String
  },
  licensing_type: {
    type: String
  },
  legal_type: {
    type: String
  },
  duration: {
    type: String
  },
  service_details: {
    type: String
  },
  requirement_documents: {
    type: String
  },
  details: {
    type: String
  },
  upload_documents: {
    type: String              
  },
  contact_name:{
    type: String
  },
  contact_no: {
    type: String
  },
  contact_email: {
    type: String
  },
  status:{
    type: Array
  },
  modifiedAt:{
    type: String
  }
})

module.exports = Application = mongoose.model('application', applicationSchema)