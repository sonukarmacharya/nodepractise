var express = require('express');
var multer = require('multer')
var path = require('path')
var empModel = require('../modules/employee')
var uploadModel = require('../modules/upload')
var router = express.Router();

var employee = empModel.find({})
var imageDisplay = uploadModel.find({})
router.use(express.static(__dirname+"./public/"))
/*multer function*/
var Storage =  multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
})

/*middleware*/
var upload = multer({
  storage:Storage
}).single('file');

/* upload file. */
router.post('/upload',upload, function(req, res, next) {
  var imageFile=req.file.filename
  var msg = req.file.filename+ "uploaded successfully "
  var imageDetails = new uploadModel({
    imagename : imageFile
  })
  imageDetails.save(function(err,doc){
    if(err) throw err
    imageDisplay.exec(function(err,data){
      if(err) throw err
      res.render('uploadfile', { title: 'Upload file',records:data,msg:msg});
       })
    })
   });
router.get('/upload', function(req, res, next) {
  imageDisplay.exec(function(err,data){
    if(err) throw err
    res.render('uploadfile', { title: 'Upload file',records:data,msg:''});
      })
     });

/* Main page*/
router.get('/', function(req, res, next) {
  employee.exec(function(err,data){
    if(err) throw err
    res.render('index', { title: 'Employee records',records:data,msg:''});
    })
  })
router.post('/', function(req, res, next) {
    var empDetails = new empModel({
        name: req.body.name,
        email: req.body.email,
        etype:req.body.type,
        hourlyrate:req.body.hrate,
        totalHour:req.body.thour,
    })
    empDetails.save(function(err,res1){
      if(err) throw err
      employee.exec(function(err,data){
        if(err) throw err
        res.render('index', { title: 'Employee records',records:data,msg:'inserted successfully'});
        })
    })
  })

/*Searching*/
 router.post('/search/', function(req, res, next) {
      var fltrName = req.body.fltrname
      var fltrEmail = req.body.fltremail
      var fltrType = req.body.fltrtype
    
      if(fltrName !='' && fltrEmail !='' && fltrType !=''){
        var filterParameter = {
          $and:[{name: fltrName},
          {$and:[{email:fltrEmail},{etype:fltrType}]}]
        }
      }
      else if(fltrName !='' && fltrEmail =='' && fltrType !=''){
        var filterParameter = {
          $and:[{name: fltrName},{etype:fltrType}]
        }
      }
      else if(fltrName =='' && fltrEmail !='' && fltrType !=''){
        var filterParameter = {
         $and:[{name: fltrName},{etype:fltrType}]
        }
      }
      else{
        var filterParameter = {}
      }

     var employeeFilter = empModel.find(filterParameter)
     employeeFilter.exec(function(err,data){
          if(err) throw err
          res.render('index', { title: 'Employee records',records:data});
          })
      }) 

      /*Deleting */
  router.get('/delete/:id', function(req, res, next) {
        var id = req.params.id
        var del = empModel.findByIdAndDelete(id)
        del.exec(function(err){
          if(err) throw err
          employee.exec(function(err,data){
            if(err) throw err
            res.render('index', { title: 'Employee records',records:data,msg:'deleted successfully'});
            }) })
        })
          
      /*Editing */
  router.get('/edit/:id', function(req, res, next) {
          var id = req.params.id
          var ed = empModel.findByIdAndUpdate(id)
          ed.exec(function(err,data){
            if(err) throw err
            res.render('edit', { title: 'Edit employee records',records:data});
            })
          });   
        router.post('/update/', function(req, res, next) {
          var update = empModel.findByIdAndUpdate(req.body.id,{
            name: req.body.name,
            email: req.body.email,
            etype:req.body.type,
            hourlyrate:req.body.hrate,
            totalHour:req.body.thour,
          })
          update.exec(function(err,data){
            if(err) throw err
            employee.exec(function(err,data){
              if(err) throw err
              res.render('index', { title: 'Employee records',records:data,msg:'updated successfully'});
              }) })
          });

          
         
module.exports = router;
