const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var path = require('path')
var app = express()
const multer = require('multer')
const session = require('express-session');
const { Validator } = require('node-input-validator');
const mongoose = require('mongoose')
const Category = require('../Categories/categoriesModel');
const Application = require('./applicationModel')
const ApplicationNotification = require('../Notification/applicationNotificationModel')
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
router.use(cors())

process.env.SECRET_KEY = 'secret'
let sessionStorage;

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    callBack(null, file.fieldname + '-' + fileName)
  }
})

let upload = multer({ storage: storage })

router.post('/create', upload.single('file'), (req, res) => {
  const validate = new Validator(req.body, {
    // licensing_location: 'required',
    // licensing_type: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        sessionStorage = req.session;
        let decoded;
        const file = req.file;

        if (file && file.filename)
          req.body.requirement_documents = file.filename;

        if (sessionStorage.token) {
          decoded = jwt.verify(sessionStorage.token, process.env.SECRET_KEY)
          req.body.userID = decoded._id;
        }

        req.body.modifiedAt = new Date().toISOString();

        req.body.status = req.body.status ? req.body.status : [];

        // const data = {
        //   applicationName: req.body.applicationName,
        //   userID: decoded._id,
        //   categoryID: req.body.categoryID,
        //   subCategoryID: req.body.subCategoryID,
        //   licensing_location: req.body.licensing_location,
        //   licensing_type: req.body.licensing_type,
        //   legal_type: req.body.legal_type,
        //   duration: req.body.duration,
        //   service_details: req.body.service_details,
        //   requirement_documents: file ? file.filename : null,
        //   details: req.body.details,
        //   upload_documents: req.body.upload_documents,
        //   legal_type: req.body.legal_type,
        //   contact_name: req.body.contact_name,
        //   contact_no: req.body.contact_no,
        //   contact_email: req.body.contact_email,
        //   status: []
        // }

        // check if application is existing then update data else create new one.
        if (req.body._id) {
          Application.updateOne({ "_id": req.body._id }, { "$set": req.body })
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
          Application.create(req.body)
            .then(response => {
              if (response) {
                let notificationData = {
                  applicationID: response.id,
                  userID: req.body.userID,
                  createdAt: new Date().toISOString()
                }
                ApplicationNotification.create(notificationData)
                  .then(response1 => {
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

router.post('/statusadd', (req, res) => {

  try {

    Application.updateOne({
      "_id": req.body.applicationId
    }, {
      "$push": {
        "status": {
          "statusId": req.body.statusId,
          "name": req.body.name,
          "comments": req.body.comments
        }
      }
    }).then(response1 => {
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
    // }
    // else{
    //   Application.create(data)
    //   .then(response => {
    //     res.status(200).json({ success: response })
    //   })
    //   .catch(err => {
    //     var message = '';
    //     if (err.message) {
    //       message = err.message;
    //     }
    //     else {
    //       message = err;
    //     }
    //     return res.status(400).send({
    //       message: message
    //     });
    //   })
    // }
    //   }
    // })
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
  Application.find({})
    .then(response => {
      if (response) {
        res.status(200).json(response)
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
})

router.post('/getFilter', (req, res) => {
  Application.find({ 'status.status': req.body.status })
    .then(response => {
      if (response) {
        res.status(200).json(response)
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
})

router.post('/getFilterCategory', (req, res) => {
  Application.find({ [req.body.property]: req.body.value })
    .then(response => {
      if (response) {
        res.status(200).json(response)
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
})


router.get('/getCounts', async (req, res) => {
  var categories = () => {
    return new Promise((resolve, reject) => {
      Category.find({ parent_category: null })
        .exec(function (err, data) {
          err
            ? reject(err)
            : resolve(data.length);
        });
    });
  };
  var subcategories = () => {
    return new Promise((resolve, reject) => {
      Category.aggregate([
        { $match: { parent_category: { $exists: true, $ne: null } } }
      ])
        .exec(function (err, data) {
          err
            ? reject(err)
            : resolve(data.length);
        });
    });
  };
  var applications = () => {
    return new Promise((resolve, reject) => {
      Application.find({})
        .exec(function (err, data) {
          err
            ? reject(err)
            : resolve(data.length);
        });
    });
  };
  var pending = () => {
    return new Promise((resolve, reject) => {
      Application.find({ 'status.status': 'Pending' })
        .exec(function (err, data) {
          err
            ? reject(err)
            : resolve(data.length);
        });
    });
  };
  var completed = () => {
    return new Promise((resolve, reject) => {
      Application.find({ 'status.status': 'Completed' })
        .exec(function (err, data) {
          err
            ? reject(err)
            : resolve(data.length);
        });
    });
  };
  var rejected = () => {
    return new Promise((resolve, reject) => {
      Application.find({ 'status.status': 'Rejected' })
        .exec(function (err, data) {
          err
            ? reject(err)
            : resolve(data.length);
        });
    });
  };
  var categoriesCount = await categories();
  var subcategoriesCount = await subcategories();
  var applicationsCount = await applications();
  var pendingCount = await pending();
  var completedCount = await completed();
  var rejectedCount = await rejected();
  var params = {
    categoriesCount: categoriesCount,
    subcategoriesCount: subcategoriesCount,
    applicationsCount: applicationsCount,
    pendingCount: pendingCount,
    completedCount: completedCount,
    rejectedCount: rejectedCount
  }
  res.json(params);
  // Application.find({})
  //   .then(response => {
  //     if (response) {
  //       res.status(200).json(response)
  //     } else {
  //       res.send('Application not found')
  //     }
  //   })
  //   .catch(err => {
  //     var message = '';
  //     if (err.message) {
  //       message = err.message;
  //     }
  //     else {
  //       message = err;
  //     }
  //     return res.status(400).send({
  //       message: message
  //     });
  //   })
})

router.get('/view', (req, res) => {
  try {
    Application.findOne({ _id: req.query.applicationid })
      .then(response => {
        res.status(200).json(response);
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
  Application.deleteOne({
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
