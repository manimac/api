const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var app = express()
const validator = require("email-validator");
const bcrypt = require('bcrypt');
const session = require('express-session');
const {Validator} = require('node-input-validator');

const Staff = require('./staffModel')
const Role = require('../RoleSetting/roleSettingsModel')
app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
router.use(cors())

process.env.SECRET_KEY = 'secret'
let sessionStorage;

router.post('/create', (req, res) => {
  const validate = new Validator(req.body, {
    name: 'required',
    mobile: 'required',
    email: 'required|email',
    role: 'required',
    password: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        let hash = bcrypt.hashSync(req.body.password, 10);
        const data = {
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email,
          role: req.body.role,
          password: hash
        }
        // check if staff is existing then update data else create new one.
        if (req.body.id) {
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
        else {
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

router.post('/login', (req, res) => {
  const validate = new Validator(req.body, {
    role: 'required',
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
          Staff.findOne({
            email: req.body.username
          })
            .then(staff => {
              if (staff) {
                if (bcrypt.compareSync(req.body.password, staff.password)) {
                  Role.findOne({
                    _id: req.body.role
                  })
                  .then(role => {
                    if(role){
                      const payload = {
                        _id: staff._id,
                        mobile: staff.mobile,
                        email: staff.email,
                        role: role.name
                      }
                      let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                      })
                      sessionStorage = req.session
                      sessionStorage.token = token
    
                      res.status(200).json({ token: token })
                    }
                    else{
                      res.json({ error: 'Role does not exist' })
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
          Staff.findOne({
            mobile: req.body.username
          })
            .then(staff => {
              if (staff) {
                if (bcrypt.compareSync(req.body.password, staff.password)) {
                  Role.findOne({
                    _id: req.body.role
                  })
                  .then(role => {
                    if(role){
                      const payload = {
                        _id: staff._id,
                        mobile: staff.mobile,
                        email: staff.email,
                        role: role.name
                      }
                      let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                      })
                      sessionStorage = req.session
                      sessionStorage.token = token
    
                      res.status(200).json({ token: token })
                    }
                    else{
                      res.json({ error: 'Role does not exist' })
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
  if(sessionStorage.token == req.headers.authorization){
    var decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    Staff.findOne({
      _id: decoded._id
    })
    .then(staff => {
      if (staff) {
        res.status(200).json({ success: staff})
      } else {
        res.send('Staff does not exist')
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
    res.send({ error:'Unauthorised Staff' });
  }
})

router.get('/get', (req, res) => {
  Staff.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "roles"
      }
    },
  ])
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

router.post('/delete', (req, res) => {
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
