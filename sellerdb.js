 
const http = require('http');
const fs =require('fs');
const { URLSearchParams } = require('url');

const mongoose = require('mongoose');
const { stringify } = require('querystring');
mongoose.connect('mongodb://127.0.0.1:27017/college')
.then(function(){
    console.log('Db connected')
})

const studentsSchema= new mongoose.Schema({name:String,email:String,Phone:String,state:String,address:String,gst:String,company:String});
const studentsmodel = mongoose.model('students',studentsSchema);

const server = http.createServer(function(req,res){
    if(req.url ==='/'){
        res.writeHead('200',{'Content-Type':'text/html'});
        fs.createReadStream('database.html').pipe(res);  
    }
    else if(req.url==='/database' && req.method === 'POST'){
        var rawdata = ''
        req.on('data',function(data){
            rawdata += data;
        })
        req.on('end',function(){
        var formdata = new URLSearchParams(rawdata); 
        res.writeHead('200',{'Content-Type':'text/html'});
        studentsmodel.create({name:formdata.get('name'),
                             email:formdata.get('email'),
                             state:formdata.get('state'),
                             address:formdata.get('address'),
                             gst:formdata.get('gst'),
                             company:formdata.get('company'),
                             
                             Phone:formdata.get('phone')
                        })
                        res.write("Data Saved Succesfully")
                        res.end();

        })
    }
    else if(req.url ==='/view' && req.method === "GET"){
        res.writeHead('200',{'Content-Type':'text/html'});
        studentsmodel.find().then(function(studentss){
            res.write("<b><h2 style='margin-left:40%'>The list of All the sellers Available</b></h2><br>")
            res.write("<br>")
            res.write("<table  border = 1 cellspacing=0 width=400>");
            res.write("<tr><th>Name</th><th> Seller Address</th><th>Email</th><th>Phone</th><th>Company Name</th><th>GST NO</th></tr>");
            studentss.forEach(students=>{
                res.write("<tr>");
                res.write("<td>" + students.name+"</td>");
                res.write("<td>" + students.address+"</td>");
                res.write("<td>" + students.email+"</td>");
                res.write("<td>" + students.Phone+"</td>");
                res.write("<td>" + students.company+"</td>");
                res.write("<td>" + students.gst+"</td>");
                res.write("<tr>");

            })
            res.end();
        })
    }
})
server.listen('5500',function(){

    console.log('server listening at 6000');
}) 