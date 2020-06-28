const express = require('express')
const router = express.Router()
const cors = require('cors')
const { Validator } = require('node-input-validator');

const ApplicationView = require('./applicationViewModel')
const Status = require('../Status/statusModel')
router.use(cors())

router.post('/create', (req, res) => {
  const validate = new Validator(req.body, {
    statusID: 'required',
    applicationID: 'required',
    comments: 'required',
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        let data = {
          statusID: req.body.statusID,
          applicationID: req.body.applicationID,
          comments: req.body.comments
        }
  
        // check if role is existing then update data else create new one.
        if(req.body.id){
          ApplicationView.updateOne({ "_id": req.body.id }, { "$set": data })
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
          ApplicationView.create(data)
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
  ApplicationView.find({})
  .then(response => {
    if (response) {
      res.status(200).json(response)
    } else {
      res.send('ApplicationViews does not found')
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

router.get('/application-status', (req, res) => {
  try{
    ApplicationView.find({
      applicationID: req.body.applicationID
    })
    .then(response => {
      if(response && response.length > 0){
        for (var i = 0; i < response.length; i++) {
          Status.find({ _id: response[i].statusID })
            .then(response2 => {
              response[i].status_name = response2[0].status
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
        res.status(200).json(response);
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

router.get('/view', (req, res) => {
  try{
    ApplicationView.findOne({
      _id: req.body.id
    })
    .then(response => {
      if (response) {
        res.status(200).json(response)
      } else {
        res.send('ApplicationView not exist')
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
  ApplicationView.deleteOne({
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
