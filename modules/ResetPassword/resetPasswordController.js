const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const validator = require("email-validator");
const bcrypt = require('bcrypt');
const {Validator} = require('node-input-validator');

const Email = require('email-templates');
const ResetPassword = require('./resetPasswordModel');
const User = require('../AccountSettings/accountSettingsModel');
const Staff = require('../Staff/staffModel');
router.use(cors())

router.post('/change-password', (req, res) => {
  const validate = new Validator(req.body, {
    oldPassword: 'required',
    password: 'required',
    confirmPassword: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        Staff.findOne({
          _id: req.body.id
        })
        .then(response => {
          if (response) {
            if (bcrypt.compareSync(req.body.oldPassword, response.password)) {
              if(req.body.password == req.body.confirmPassword) {
                let hash = bcrypt.hashSync(req.body.password, 10);
                const data = {
                  password: hash
                }
                Staff.updateOne({ "_id": req.body.id }, { "$set": data })
                .then(response1 => {
                  res.status(200).json({ success: response1, message: "Change password successfully" })
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
                throw new Error('Passwords are not matched');
              }
            }
            else {
              throw new Error('InCorrect Password');
            }
          }
          else {
            throw new Error('User does not exist');
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

router.post('/forget-password', (req, res) => {
  const validate = new Validator(req.body, {
    email: 'required|email'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        User.findOne({
          email: req.body.email
        })
        .then(response => {
          if (response) {
            let password = Math.round(Math.random() * 1E9).toString()
            let hash = bcrypt.hashSync(password, 10);
            const data = {
              password: hash
            }
            User.updateOne({ "email": req.body.email }, { "$set": data })
            .then(response1 => {
              const email = new Email({
                secure: true,
                message: {
                    from: 'venkat99mca@gmail.com',
                    subject: 'Temporary Password for Prozone Account',
                    html: `<div>
                    <p>Temporary password is <strong>${password}</strong>. It's to reset your Prozone account</p><br>
                    <p><i><small>Don't reply to this mail<small></i>.</p>
                </div>`
  
                },
                htmlToText: false,
                send: true,
                preview: false,
                transport: {
                  service: 'Gmail',
                  secureConnection: true,
                  auth: {
                    user: 'venkat99mca@gmail.com', 
                    pass: 'Venkat@#9100' 
                  }
                    // service: 'gmail',
                    // host: 'smtp.gmail.com',//'smtp.office365.com',
                    // port: 465,
                    // auth: {
                    //     user: "venkat99mca@gmail.com",
                    //     pass: "Venkat@#9100"
                    // },
                }
            });
  
            email
              .send({
                message: {
                    to: req.body.email
                }
              })
              .then(
                res.status(200).json({ success: response1, message: "Reset password successfully" })
              )
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
            throw new Error('Email does not exist');
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

router.post('/reset-password', (req, res) => {
  const validate = new Validator(req.body, {
    email: 'required|email'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        Staff.findOne({
          email: req.body.email
        })
        .then(response => {
          if (response) {
            let password = Math.round(Math.random() * 1E9).toString()
            let hash = bcrypt.hashSync(password, 10);
            const data = {
              password: hash
            }
            Staff.updateOne({ "email": req.body.email }, { "$set": data })
            .then(response1 => {
              const email = new Email({
                secure: true,
                message: {
                    from: 'venkat99mca@gmail.com',
                    subject: 'Temporary Password for Prozone Account',
                    html: `<div>
                    <p>You can use this temporary password <strong>${password}</strong> in your Prozone account</p><br>
                    <p><i><small>Don't reply to this mail<small></i>.</p>
                </div>`
  
                },
                htmlToText: false,
                send: true,
                preview: false,
                transport: {
                  service: 'Gmail',
                  secureConnection: true,
                  auth: {
                    user: 'manimaccse@gmail.com', 
                    pass: 'jqhynxqjvrvuyqsg' 
                  }
                }
            });
  
            email
              .send({
                message: {
                    to: req.body.email
                }
              })
              .then(
                res.status(200).json({ success: response1, message: "Reset password successfully" })
              )
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
            throw new Error('Email does not exist');
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

module.exports = router