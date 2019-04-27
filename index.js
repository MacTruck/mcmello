var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

// Connect to the database

var url = 'mongodb+srv://scott:high5ers@mcmello-cluster-2bzb4.mongodb.net/mcmello-database?retryWrites=true';

mongoose.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) { console.log('Oh no... Error:', err); }
});

var connection = mongoose.connection;
var prints;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
    connection.db.collection('prints', function(err, collection){
        collection.find({}).toArray(function(err, data){
        	prints = data;
        })
    });
});

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
	// prints.find({}, function(err, data){
	// 	if (err) throw err;
		res.render('art', {prints: prints});
	});
// });

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