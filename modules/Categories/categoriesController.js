const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var path = require('path')
const multer = require('multer')
const Category = require('./categoriesModel')
const { Validator } = require('node-input-validator');
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
    name_english: 'required',
    color: 'required'
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
        if(file && file.filename)
          req.body.icon = file.filename;
          
        if(req.body.id){
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

router.get('/get-category', (req, res) => {
  Category.find({
    parent_category: null
  })
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
  Category.find({ parent_category: { $exists: true, $ne: null } })
    .then(response => {
      if (response) {
        if (response.length > 0) {
          for (var i = 0; i < response.length; i++) {
            Category.find({ _id: response[i].parent_category })
              .then(response2 => {
                response[i].category_name = response2[0].name_english
                // console.log(response[i].category_name)
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
          res.status(200).json({ success: response });
        }
      } else {
        res.send('Sub Category not found')
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


router.delete('/delete', (req, res) => {
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
