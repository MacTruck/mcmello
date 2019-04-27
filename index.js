var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

// Connect to the database

mongoose.connect('mongodb+srv://scott:high5ers@mcmello-cluster-2bzb4.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

// var printSchema = new mongoose.Schema({
// 	id: String,
// 	title: String,
// 	date: String,
// 	image: String,
// 	specs: String,
// 	desc: String,
// 	shape: String,
// });

//  var prints = mongoose.model('Prints', printSchema);

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.listen(5000, function () {
	console.log('App listening on port 5000');
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/index', function(req, res) {
	res.render('index');
});

app.get('/art', function(req, res) {
	db.prints.find({}, function(err, data){
		if (err) throw err;
		res.render('art', {prints: data});
	});
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.get('/inquire', function(req, res) {
	res.render('inquire');
});

app.post('/inquire', jsonParser, function(req, res) {
	console.log(req.body);
	res.render('inquire-success', {data: req.body});
});