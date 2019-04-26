var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.listen(5000, function () {
	console.log('App listening on port 5000');
});

app.get('/', function(req, res) {
	console.log("where are you?");
	res.render('index');
	// res.render('index');
});

app.get('/art', function(req, res) {
	res.render('art');
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

console.log("Supposedly running...");