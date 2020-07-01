const express = require('express')
const router = express.Router()
const cors = require('cors')
var path = require('path')
const multer = require('multer')
const Events = require('./eventsModel')
const EventNotification = require('../Notification/eventNotificationModel')
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
  try{
    const file = req.file;
    const data = {
      icon: file ? file.filename : null,
      comments: req.body.comments
    }
    if(file && file.filename)
      req.body.file_upload = file.filename;

    // check if category is existing then update data else create new one.
    if(req.body.id){
      Events.updateOne({ "_id": req.body.id }, { "$set": req.body })
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
    }
    else{
      Events.create(data)
      .then(response => {
        if(response){
          let notificationData = {
            eventID: response.id,
            createdAt: new Date().toISOString()
          }
          EventNotification.create(notificationData)
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
  Events.find({}).sort( { _id: -1 })
  .then(response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.send('Events not found')
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
  Events.findOne({
    _id: req.body.id
  })
  .then(response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.send('Events does not exist')
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


router.post('/delete', (req, res) => {
  Events.deleteOne({
    _id: req.body.id
  })
  .then(response => {
    res.status(200).json({ success: response });
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
