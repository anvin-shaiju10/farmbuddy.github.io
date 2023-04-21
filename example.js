const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bank')
		.then(function(){
			console.log('DB Connected')
		})
		.catch(function(){
			console.log('DB Connection Error')
		})

const customerSchema = new mongoose.Schema({name:String, password:String, age:Number, mobile:Number, email:String, gender:String, state:String})
//, gender:String, state:String
const dbModel = mongoose.model('customers',customerSchema)

const server = http.createServer(function (req,res){
	if(req.url==='/'){
		res.writeHead('200',{'Content-Type':'text/html'})
		fs.createReadStream('form.html').pipe(res)
	}

	else if(req.url ==='/server' && req.method == 'POST'){
		var rawData = '';
		req.on('data',function(data){
			rawData += data;
			data;
		})
		req.on('end',function(){
			var inputdata = new URLSearchParams(rawData);
			res.writeHead(200,{"Content-Type": "text/html"});
			dbModel.create({name:inputdata.get('username'),password:inputdata.get('userpass'), age: inputdata.get('userage'), mobile: inputdata.get('usernum'), email: inputdata.get('useremail'), gender: inputdata.get('gender'), state: inputdata.get('state')})
			//, gender: inputdata.get('gender'), state: inputdata.get('state')
			res.write("Data Saved Succesfully")
			res.end();
		});
	}

	else if(req.url === '/view' && req.method==='GET'){
		res.writeHead('200',{'Content-Type':'text/html'})
		dbModel.find().then(function(customers){
			res.write("<table style='border: 1px solid blue;'>");
			res.write("<tr>");
			res.write("<th>Name</th>");
			res.write("<th>Email</th>");
			res.write("<tr>");
			customers.forEach(customer => {
				res.write("<tr>");
				res.write("<td>"+customer.name+"</td>");
				res.write("<td>"+customer.email+"</td>");
				res.write("</tr>");
			})
			res.write("</table>");
		})
	}
});

server.listen(9000,function(){
	console.log("Server is listening at 9000");
});