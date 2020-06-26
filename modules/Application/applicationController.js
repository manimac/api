const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const validator = require("email-validator");

const Application = require('./applicationModel')
router.use(cors())

process.env.SECRET_KEY = 'secret'

router.post('/create', (req, res) => {
  
  try {
      const data = {
        licensing_location: req.body.licensing_location,
        licensing_type: req.body.licensing_type,
        legal_type: req.body.legal_type,
        duration: req.body.duration,
        service_details: req.body.service_details,
        requirement_documents: req.body.requirement_documents,
        details: req.body.details,
        upload_documents: req.body.upload_documents,
        legal_type: req.body.legal_type,
        contact_name: req.body.contact_name,
        contact_no: req.body.contact_no,
        contact_email: req.body.contact_email
      }

    // check if application is existing then update data else create new one.
    if(req.body.id){
      Application.findOne({
        _id: ObjectID(req.body.id)
      })
      .then(response => {
        if (response) {
          Application.updateOne(data)
            .then(response1 => {
              res.status(200).json({ response: response1, message: "updated" })
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
    else{
      Application.create(data)
      .then(response => {
        res.status(200).json({ response: response })
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
  try{
      Application.find({})
      .then(response => {
        if (response) {
          res.status(200).json({ response: response })
          //res.json(response);
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
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    Application.findOne({
      _id: ObjectID(req.body.id)
    })
    .then(response => {
      if (response) {
        res.status(200).json({ response: response })
        //res.json(response);
      } else {
        res.send('Category does not exist')
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

router.delete('/delete', (req, res) => {
  try{
    Application.deleteOne({
      _id: ObjectID(req.body.id)
    })
    .then(user => {
      res.status(200).json({ response: response })
      //res.json(response);
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

module.exports = router
