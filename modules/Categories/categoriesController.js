const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var path = require('path')
const multer = require('multer')
const Category = require('./categoriesModel')
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
  const file = req.file;
  const data = {
    parent_category: req.body.parent_category,
    name: req.body.name,
    icon: file.filename,
    color: req.body.color,
    sequence: req.body.sequence,
    active: false
  }

  Category.create(data)
    .then(response => {
      res.status(200).json({ response: response })
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

router.get('/get', (req, res) => {
  
  //throw new Error('Please enter the confirm password');
  Category.find({})
    .then(response => {
      if (response) {
        res.json(response);
      } else {
        res.send('Category not found')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

router.get('/view', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  Category.findOne({
    _id: decoded._id
  })
    .then(response => {
      if (response) {
        res.json(response)
      } else {
        res.send('Category does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
module.exports = router