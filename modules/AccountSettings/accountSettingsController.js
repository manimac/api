const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const validator = require("email-validator");
const bcrypt = require('bcrypt');

const User = require('./accountSettingsModel')
router.use(cors())

process.env.SECRET_KEY = 'secret'

router.post('/register', (req, res) => {
  
  try {
    if (!req.body.email) {
      throw new Error('Please enter the email');
    }
    else if (!req.body.mobile) {
      throw new Error('Please enter the mobile number');
    }
    else if (!req.body.password) {
      throw new Error('Please enter the password');
    }
    else if (!req.body.confirmPassword) {
      throw new Error('Please enter the confirm password');
    }
    else if (req.body.password != req.body.confirmPassword) {
      throw new Error('Password and Confirm Password are mismatched');
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
                res.json({ token: token, message: "Registered Successfully" })
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
            res.json({ token: token, email: user.email })
          }
          else {
            res.json({ error: 'Invalid Password' })
          }
        } else {
          res.json({ error: 'Invalid user' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
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
            res.json({ token: token })
          }
          else {
            res.json({ error: 'InCorrect Password' })
          }
        } else {
          res.json({ error: 'Invalid user' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }


})

router.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

router.get('/allUserData', (req, res) => {
  User.find({})
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('No userData')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})


router.put('/updateProfile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  let hash = bcrypt.hashSync(req.body.password, 10);
  const userData = {
    mobile: req.body.mobile,
    email: req.body.email,
    password: hash
  }
  if (req.body.password == req.body.confirmPassword) {
    User.findOne({
      _id: decoded._id
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
              res.json({ token: payload, message: "updated" })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        } else {
          res.json({ error: 'User not exists' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }
  else {
    res.json({ error: 'Passwords are mismatched' })
  }
})

router.delete('/deleteProfile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  User.deleteOne({
    _id: decoded._id
  })
    //TODO bcrypt
    .then(user => {
      res.json({ message: "deleted" })
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = router