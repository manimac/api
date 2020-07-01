const express = require('express')
const router = express.Router()
const cors = require('cors')
const { Validator } = require('node-input-validator');

const Status = require('./statusModel')
router.use(cors())

router.post('/create', (req, res) => {
  const validate = new Validator(req.body, {
    status: 'required',
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        let data = {
          status: req.body.status
        }
  
        // check if role is existing then update data else create new one.
        if(req.body.id){
          Status.updateOne({ "_id": req.body.id }, { "$set": data })
            .then(response => {
              res.status(200).json({ success: response, message: "updated" })
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
          Status.create(data)
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
  Status.find({})
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

router.get('/view', (req, res) => {
  try{
    Status.findOne({
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

router.delete('/delete', (req, res) => {
  Status.deleteOne({
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
