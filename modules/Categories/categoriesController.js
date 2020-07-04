const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var path = require('path')
const multer = require('multer')
const Category = require('./categoriesModel')
const Settings = require('./settingsModel');
const { Validator } = require('node-input-validator');
var async = require('async');
router.use(cors())

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
    name_english: 'required'
  });

  try {
    validate.check().then((matched) => {
      if (!matched) {
        res.status(400).send(validate.errors);
      }
      else {
        const file = req.file;
        const data = {
          parent_category: req.body.parent_category ? req.body.parent_category : null,
          name_english: req.body.name_english,
          name_arabic: req.body.name_arabic,
          icon: file ? file.filename : null,
          color: req.body.color,
          business: req.body.business,
          individual: req.body.individual,
          sequence: req.body.sequence,
          active: false
        }
        if (file && file.filename)
          req.body.icon = file.filename;

        if (req.body.id) {
          Category.updateOne({ "_id": req.body.id }, { "$set": req.body })
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
          Category.create(data)
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

router.get('/get-categories', (req, res) => {
  Category.find({parent_category: null}).sort({ _id: -1}).exec(function(err, categories) {
    if (err) {
        res.status(500).json({code: 500, message: 'Internal server error'});
    } else {
        async.eachSeries(categories, function (item, outerCallback) {
          Category.find({'parent_category': item.id}).exec(function (err, subcategories) {
                if (err) {
                    outerCallback(err);
                } else {
                    var item2 = [];
                    async.eachSeries(subcategories, function (item, innerCallback) {
                        // count += item.comments_count + item.likes_count;
                        item2.push(item);
                        innerCallback();
                    }, function () {
                        if (err) {
                            outerCallback(err);
                        } else {
                          if(item2){
                            item.sub_categories = item2;
                          }                          
                            // item.totalAmount = count;
                            outerCallback();
                        }
                    });
                }
            });
        }, function () {
            res.json(categories);
        });
    }
});
  // Category.find({
  //   parent_category: null
  // }).sort( { _id: -1 })
  //   .exec(function(err, response) => {
  //     if (response) {
  //       for(var i = 0;i < response.length;i++){
  //         Category.find({
  //           parent_category: response[i].id
  //         }).sort( { _id: -1 })
  //           .then(response2 => {
  //             if(response2 && Array.isArray(response2) && response2.length > 0){
  //               response[i].sub_category = response2;
  //             }
              
  //           });
  //       }
  //       console.log(response);
  //       res.status(200).json(response);
  //     } else {
  //       res.send('Category not found')
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

router.get('/get-category', (req, res) => {
  Category.find({
    parent_category: null
  }).sort( { _id: -1 })
    .then(response => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.send('Category not found')
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

router.get('/get-subcategory', (req, res) => {
  Category.aggregate([
    { $match: { parent_category: { $exists: true, $ne: null } } },
    {
      $lookup: {
        from: "categories",
        localField: "parent_category",
        foreignField: "_id",
        as: "parent_categories"
      }
    }, 
    { $sort : { _id : -1 }}
  ])
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
  // Category.find({ parent_category: { $exists: true, $ne: null } })
  //   .then(response => {
  //     if (response) {
  //       if (response.length > 0) {
  //         for (var i = 0; i < response.length; i++) {
  //           Category.find({ _id: response[i].parent_category })
  //             .then(response2 => {
  //               response[i].category_name = response2[0].name_english

  //               // console.log(response[i].category_name)
  //             })
  //             .catch(err => {
  //             var message = '';
  //             if (err.message) {
  //               message = err.message;
  //             }
  //             else {
  //               message = err;
  //             }
  //             return res.status(400).send({
  //               message: message
  //             });
  //           })
  //         }
  //         res.status(200).json(response);
  //       }
  //       else{
  //         res.status(200).json([]);
  //       }
  //     } else {
  //       res.status(200).json([]);
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

router.get('/get-landingpage', (req, res) => {
  Settings.find()
    .then(response => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.send('Not found')
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
  Category.deleteOne({
    _id: req.body.id
  })
    .then(user => {
      res.status(200).json({ success: user })
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
