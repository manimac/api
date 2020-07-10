var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
const session = require('express-session');
var port = process.env.PORT || 3000

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  },{limit: '10mb', extended: true})
)
app.use(express.static('uploads'));
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
// var SubCategory = require('./modules/SubCategories/subCategoriesController');
var Application = require('./modules/Application/applicationController');
var Events = require('./modules/Events/eventsController');
var Staff = require('./modules/Staff/staffController');
var Role = require('./modules/RoleSetting/roleSettingsController');
var Status = require('./modules/Status/statusController');
var ApplicationView = require('./modules/ApplicationView/applicationViewController');
var ResetPassword = require('./modules/ResetPassword/resetPasswordController');
var FormFields = require('./modules/FormFields/formFieldsController');

app.use('/api/category', Category)
app.use('/api/events', Events)
app.use('/api/users', Users)
app.use('/api/staffs', Staff)
app.use('/api/roles', Role)
app.use('/api/resetPassword', ResetPassword)
app.use('/user', Users)
app.use('/category', Category)
app.use('/application', Application)
app.use('/events', Events)
app.use('/staff', Staff)
app.use('/role', Role)
app.use('/status', Status)
app.use('/applicationView', ApplicationView)
app.use('/resetPassword', ResetPassword)
app.use('/formFields', FormFields)
app.use('/', (req, res) => {
  // res.writeHead(200, {'Content-Type': 'text/html'});
  // //Return the url part of the request object:
  // res.write('Application Connected');
  // res.end();

  var message = 'Api was not found'
  return res.status(400).send({
    message: message
  });
});
app.use('*', function(req,res){
  var message = 'Api was not found'
  return res.status(400).send({
    message: message
  });
})

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})

