var mongoose = require('mongoose')
//creating db called employee
mongoose.connect('mmongodb://localhost:27017/employee',{useNewUrlParser:true})
var conn = mongoose.connection

var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    etype: String,
    hourlyrate: Number,
    totalHour: Number,
    
})
var employeeModel = mongoose.model('Employee',employeeSchema)

module.exports = employeeModel