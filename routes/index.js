var express = require('express');
var empModel = require('../modules/employee')
var router = express.Router();
var employee = empModel.find({})

/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec(function(err,data){
    if(err) throw err
    res.render('index', { title: 'Employee records',records:data});
    })
  });

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
        res.render('index', { title: 'Employee records',records:data,});
        })
    })
  })


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

      router.get('/delete/:id', function(req, res, next) {
        var id = req.params.id
        var del = empModel.findByIdAndDelete(id)
        del.exec(function(err){
          if(err) throw err
          res.redirect('/')
        })
          
        });

        router.get('/edit/:id', function(req, res, next) {
          var id = req.params.id
          var ed = empModel.findByIdAndUpdate(id)
          ed.exec(function(err,data){
            if(err) throw err
            res.render('edit', { title: 'Edit employee records',records:data,msg:''});
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
            res.render('edit', { title: 'Edit employee records'