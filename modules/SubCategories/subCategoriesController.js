const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var path = require('path')
const multer = require('multer')
const SubCategory = require('./subCategoriesModel')
const { response } = require('express')
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
  try{
    const file = req.file;
    const data = {
      parent_category: req.body.parent_category,
      name_english: req.body.name_english,
      name_arabic: req.body.name_arabic,
      icon: file.filename,
      color: req.body.color,
      business: req.body.business,
      individual: req.body.individual,
      sequence: req.body.sequence,
      active: false
    }

    // check if category is existing then update data else create new one.
    if(req.body.id){
      SubCategory.findOne({
        _id: ObjectID(req.body.id)
      })
      .then(response => {
        if (response) {
          SubCategory.updateOne(data)
            .then(response1 => {
              res.status(200).json({ response: response1, message: "updated" })
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
    else{
      SubCategory.create(data)
      .then(response => {
        res.status(200).json({ response: response })
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

router.get('/get', (req, res) => {
  try{
    SubCategory.find({})
    .then(response => {
      if (response) {
        res.status(200).json(response)
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
    SubCategory.findOne({
      _id: ObjectID(req.body.id)
    })
    .then(response => {
      if (response) {
        res.status(200).json(response)
      } else {
        res.send('Sub Category does not exist')
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
  try{
    SubCategory.deleteOne({
      _id: ObjectID(req.body.id)
    })
    .then(user => {
      res.status(200).json({ response: response })
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