const http = require('http');
const fs =require('fs');
const { URLSearchParams } = require('url');

const mongoose = require('mongoose');
const { stringify } = require('querystring');
mongoose.connect('mongodb://127.0.0.1:27017/assistance')
.then(function(){
    console.log('Db connected')
})

const issueSchema= new mongoose.Schema({name:String,email:String,Phone:String,state:String,address:String,crop:String,issuedes:String});
const issuemodel = mongoose.model('issue',issueSchema);

const server = http.createServer(function(req,res){
    if(req.url ==='/'){
        res.writeHead('200',{'Content-Type':'text/html'});
        fs.createReadStream('assistance.html').pipe(res);  
    }
    else if(req.url==='/assistance' && req.method === 'POST'){
        var rawdata = ''
        req.on('data',function(data){
            rawdata += data;
        })
        req.on('end',function(){
        var formdata = new URLSearchParams(rawdata); 
        res.writeHead('200',{'Content-Type':'text/html'});
        issuemodel.create({name:formdata.get('name'),
                             email:formdata.get('email'),
                             state:formdata.get('state'),
                             address:formdata.get('address'),
                             crop:formdata.get('crop'),
                             issuedes:formdata.get('issuedes'),
                             
                             Phone:formdata.get('phone')
                        })
                        res.write("Issue Send  Succesfully, Our Expert Will be In Touch With You Soon")
                        res.end();

        })
    }
    else if(req.url ==='/view1' && req.method === "GET"){
        res.writeHead('200',{'Content-Type':'text/html'});
        issuemodel.find().then(function(issues){
            res.write("<b><h2 style='margin-left:40%'>The list of All the sellers Available</b></h2><br>")
            res.write("<br>")
            res.write("<table  border = 1 cellspacing=0 width=800>");
            res.write("<tr><th>Name</th><th> Seller Address</th><th>Email</th><th>Phone</th><th>Company Name</th><th>GST NO</th></tr>");
            issues.forEach(issue=>{
                res.write("<tr>");
                res.write("<td>" + issue.name+"</td>");
                res.write("<td>" + issue.address+"</td>");
                res.write("<td>" + issue.email+"</td>");
                res.write("<td>" + issue.Phone+"</td>");
                res.write("<td>" + issue.crop+"</td>");
                res.write("<td>" + issue.issuedes+"</td>");
                res.write("<tr>");

            })
            res.end();
        })
    }
})
server.listen('5500',function(){

    console.log('server listening at 6000');
}) 