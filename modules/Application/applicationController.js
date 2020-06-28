const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var path = require('path')
const multer = require('multer')
const { Validator } = require('node-input-validator');
const mongoose = require('mongoose')
const Application = require('./applicationModel')
const ApplicationNotification = require('../Notification/applicationNotificationModel')
router.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    callBack(null, file.fieldname + '-' + fileName)
  }
})

let upload = multer({ storage: storage })

router.post('/create', upload.single('file'), (req, res) => {
  const validate = new Validator(req.body, {
    // licensing_location: 'required',
    // licensing_type: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        const file = req.file;
        const data = {
          licensing_location: req.body.licensing_location,
          licensing_type: req.body.licensing_type,
          legal_type: req.body.legal_type,
          duration: req.body.duration,
          service_details: req.body.service_details,
          requirement_documents: file ? file.filename : null,
          details: req.body.details,
          upload_documents: req.body.upload_documents,
          legal_type: req.body.legal_type,
          contact_name: req.body.contact_name,
          contact_no: req.body.contact_no,
          contact_email: req.body.contact_email,
          status: []
        }
        if(file && file.filename)
          req.body.requirement_documents = file.filename;
  
        // check if application is existing then update data else create new one.
        if(req.body.id){
          Application.updateOne({ "_id": req.body.id }, { "$set": req.body })
            .then(response1 => {
              res.status(200).json({ success: response1, message: "updated" })
            })
            .catch(err => {
              var message = '';
              if (err.message) {
                message = err.message;
              }
              else {
                message = err;
              }
              return res.status(400).send({
                message: message
              });
            })
        }
        else{
          Application.create(data)
          .then(response => {
            if(response){
              let notificationData = {
                applicationID: response.id,
                //userID: req.body.userID ? req.body.userID : 'testing1', 
                createdAt: new Date().toISOString()
              }
              ApplicationNotification.create(notificationData)
              .then(response1 => {
                res.status(200).json({ success: response })
              })
              .catch(err => {
                var message = '';
                if (err.message) {
                  message = err.message;
                }
                else {
                  message = err;
                }
                return res.status(400).send({
                  message: message
                });
              })
            }
          })
          .catch(err => {
            var message = '';
            if (err.message) {
              message = err.message;
            }
            else {
              message = err;
            }
            return res.status(400).send({
              message: message
            });
          })
        }
      }
    })
  }
  catch (err) {
    var message = '';
    if (err.message) {
      message = err.message;
    }
    else {
      message = err;
    }
    return res.status(400).send({
      message: message
    });
  }

})

router.get('/get', (req, res) => {  
  Application.find({})
  .then(response => {
    if (response) {
      res.status(200).json(response)
    } else {
      res.send('Application not found')
    }
  })
  .catch(err => {
    var message = '';
    if (err.message) {
      message = err.message;
    }
    else {
      message = err;
    }
    return res.status(400).send({
      message: message
    });
  })
})

router.get('/view', (req, res) => {
  try{
    Application.aggregate([
      {$match: {id: req.query.applicationId}}
    ])
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      var message = '';
      if (err.message) {
        message = err.message;
      }
      else {
        message = err;
      }
      return res.status(400).send({
        message: message
      });
    })
  }
  catch (err) {
    var message = '';
    if (err.message) {
      message = err.message;
    }
    else {
      message = err;
    }
    return res.status(400).send({
      message: message
    });
  }
})

router.post('/delete', (req, res) => {
  Application.deleteOne({
    _id: req.body.id
  })
  .then(response => {
    res.status(200).json({ success: response })
  })
  .catch(err => {
    var message = '';
    if (err.message) {
      message = err.message;
    }
    else {
      message = err;
    }
    return res.status(400).send({
      message: message
    });
  })
})

module.exports = router
