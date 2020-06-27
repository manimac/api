const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const validator = require("email-validator");
const bcrypt = require('bcrypt');
const {Validator} = require('node-input-validator');


const User = require('./accountSettingsModel')
router.use(cors())

process.env.SECRET_KEY = 'secret'

router.post('/register', (req, res) => {
  const validate = new Validator(req.body, {
    mobile: 'required',
    email: 'required|email',
    password: 'required',
    confirmPassword: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else if(req.body.password == req.body.confirmPassword) {
        let hash = bcrypt.hashSync(req.body.password, 10);
        const userData = {
          mobile: req.body.mobile,
          email: req.body.email,
          password: hash
        }
        User.findOne({
          email: req.body.email
        })
          //TODO bcrypt
          .then(user => {
            if (!user) {
              User.create(userData)
                .then(user => {
                  const payload = {
                    _id: user._id,
                    mobile: user.mobile,
                    email: user.email
                  }
                  let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                  })
                  res.status(200).json({ token: token, message: "Registered Successfully" })
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
            } else {
              throw new Error('Email already exists');
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
      else {
        throw new Error('Password are not matched');
      }
    });
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

router.post('/login', (req, res) => {
  const validate = new Validator(req.body, {
    username: 'required',
    password: 'required'
  });
  try{
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        if (validator.validate(req.body.username)) {
          User.findOne({
            //email: req.body.email
            email: req.body.username
          })
            .then(user => {
              if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                  const payload = {
                    _id: user._id,
                    mobile: user.mobile,
                    email: user.email
                  }
                  let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                  })
                  res.status(200).json({ token: token, email: user.email })
                }
                else {
                  res.json({ error: 'Invalid Password' })
                }
              } else {
                res.json({ error: 'Invalid user' })
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
        else {
          User.findOne({
            mobile: req.body.username
          })
            .then(user => {
              if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                  const payload = {
                    _id: user._id,
                    mobile: user.mobile,
                    email: user.email
                  }
                  let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                  })
                  res.status(200).json({ token: token })
                }
                else {
                  res.json({ error: 'InCorrect Password' })
                }
              } else {
                res.json({ error: 'Invalid user' })
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

router.get('/view', (req, res) => {
  User.findOne({
    _id: req.body.id
  })
  .then(user => {
    if (user) {
      res.status(200).json({ success: user})
    } else {
      res.send('User does not exist')
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
  User.find({})
  .then(user => {
    if (user) {
      res.status(200).json({ response: user})
    } else {
      res.send('No userData')
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


router.put('/update', (req, res) => {
  let hash = bcrypt.hashSync(req.body.password, 10);
  try{
    const data = {
      mobile: req.body.mobile,
      email: req.body.email,
      password: hash
    }
    // if (req.body.password == req.body.confirmPassword) {

      User.updateOne({ "_id": req.body.id }, { "$set": data })
        .then(user => {
          const payload = {
            _id: user._id,
            mobile: user.mobile,
            email: user.email
          }
          res.status(200).json({ token: payload, message: "updated" })
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
    // }
    // else {
    //   res.json({ error: 'Passwords are mismatched' })
    // }
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
  User.deleteOne({
    _id: req.body.id
  })
  .then(user => {
    res.status(200).json({ success: user, message: "deleted" })
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