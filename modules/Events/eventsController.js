const express = require('express')
const router = express.Router()
const cors = require('cors')
var path = require('path')
const multer = require('multer')
const Events = require('./eventsModel')
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
      file_upload: file.filename,
      comments: req.body.comments
    }

    // check if category is existing then update data else create new one.
    if(req.body.id){
      Events.updateOne({ "_id": req.body.id }, { "$set": req.body })
        .then(response => {
          res.status(200).json({ response: response, message: "updated" })
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
  Events.find({})
  .then(response => {
    if (response) {
      res.status(200).json({ success: response });
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
      res.status(200).json({ success: response });
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


router.delete('/delete', (req, res) => {
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
