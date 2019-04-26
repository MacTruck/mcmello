#!/usr/bin/env nodejs
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080, 'localhost');
console.log('Server running at http://localhost:8080/');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req, res) {
	console.log("where are you?");
	res.render('index');
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