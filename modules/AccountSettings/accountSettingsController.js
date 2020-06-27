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
    // if (!req.body.email) {
    //   throw new Error('Please enter the email');
    // }
    // else if (!req.body.mobile) {
    //   throw new Error('Please enter the mobile number');
    // }
    // else if (!req.body.password) {
    //   throw new Error('Please enter the password');
    // }
    // else if (!req.body.confirmPassword) {
    //   throw new Error('Please enter the confirm password');
    // }
    // else if (req.body.password != req.body.confirmPassword) {
    //   throw new Error('Password and Confirm Password are mismatched');
    // }
    
    validate.check().then((matched) => {
      if (!matched) {
        console.log(validate.errors)
        res.status(400).send(validate.errors);
      }
      else {
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
  try{
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
    User.findOne({
      _id: ObjectID(req.body.id)
    })
    .then(user => {
      if (user) {
        res.status(200).json(user)
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
    User.find({})
    .then(user => {
      if (user) {
        res.status(200).json(user)
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


router.put('/update', (req, res) => {
  try{
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    let hash = bcrypt.hashSync(req.body.password, 10);
    const userData = {
      mobile: req.body.mobile,
      email: req.body.email,
      password: hash
    }
    if (req.body.password == req.body.confirmPassword) {
      User.findOne({
        _id: ObjectID(req.body.id)
      })
        //TODO bcrypt
        .then(user => {
          if (user) {
            User.updateOne(userData)
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
          } else {
            res.json({ error: 'User not exists' })
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
      res.json({ error: 'Passwords are mismatched' })
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

router.delete('/delete', (req, res) => {
  try{
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    User.deleteOne({
      _id: ObjectID(req.body.id)
    })
    .then(user => {
      res.status(200).json({ message: "deleted" })
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