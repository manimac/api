const express = require('express')
const router = express.Router()
const cors = require('cors')
const { Validator } = require('node-input-validator');

const Staff = require('./staffModel')
router.use(cors())

router.post('/create', (req, res) => {
  const validate = new Validator(req.body, {
    name: 'required',
    mobile: 'required',
    email: 'required|email',
    role: 'required',
    password: 'required',
    confirmPassword: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else if(req.body.password == req.body.confirmPassword) {
        const data = {
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email,
          role: req.body.role,
          password: req.body.password
        }
        // check if staff is existing then update data else create new one.
        if(req.body.id){
          Staff.updateOne({ "_id": req.body.id }, { "$set": data })
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
          Staff.create(data)
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
      else {
        throw new Error('Password are not matched');
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
  Staff.find({})
  .then(response => {
    if (response) {
      res.status(200).json(response)
    } else {
      res.send('Staffs does not found')
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
    Staff.findOne({
      _id: req.body.id
    })
    .then(response => {
      if (response) {
        res.status(200).json({ success: response })
        //res.json(response);
      } else {
        res.send('Staff not exist')
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
  Staff.deleteOne({
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
