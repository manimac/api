const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const FormFields = require('./formFieldsModel')
const { Validator } = require('node-input-validator');
router.use(cors())

router.post('/create', (req, res) => {
  const validate = new Validator(req.body, {
    application_name: 'required',
    label: 'required',
    name: 'required',
    type: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        const data = {
          application_name: req.body.application_name,
          label: req.body.label,
          name: req.body.name,
          type: req.body.type,
          sequence: req.body.sequence
        }
        
        if (req.body.id) {
          FormFields.updateOne({ "_id": req.body.id }, { "$set": req.body })
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
        else {
          FormFields.create(data)
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

router.post('/view', (req, res) => {
  FormFields.find({
    _id: req.body.id
  })
  .then(response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.send('FormFields does not found')
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


router.get('/get', (req, res) => {
  FormFields.find()
    .then(response => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.send('Not FormFields found')
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
  FormFields.deleteOne({
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
