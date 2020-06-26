var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
var port = process.env.PORT || 3000

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  },{limit: '10mb', extended: true})
)

// const mongoURI = 'mongodb://localhost:27017/myDB'
const mongoURI = 'mongodb://prozone:prozone123@ds135680.mlab.com:35680/heroku_vwsh5spj';
// const mongoURI = 'mongodb+srv://venkat:Vijay9100@mycluster1-n3wil.mongodb.net/test';

mongoose
  .connect(
    mongoURI,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

var Users = require('./modules/AccountSettings/accountSettingsController');
var Category = require('./modules/Categories/categoriesController');
var SubCategory = require('./modules/SubCategories/subCategoriesController');


app.use('/user', Users)
app.use('/api/category', Category)
app.use('/category', Category)
app.use('/sub-category', SubCategory)
app.use('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  //Return the url part of the request object:
  res.write('Application Connected');
  res.end();
});

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})

