const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// Body Parser middleware -- For inquiry email
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var inquiryEmail = config.inquiryEmail;
var inquiryPassword = config.inquiryPassword;
var inquirySendTo = config.inquirySendTo;

// --- database alternative js object

var printModule = require('./printList.js');
var printList = printModule.printList;

// // Connect to the database -- mongodb antiquated

// 	var url = config.serverUrl;

// 	mongoose.connect(url, { useNewUrlParser: true }, function(err, db) {
// 	    if (err) { console.log('Oh no... Error:', err); }
// 	});

// 	var connection = mongoose.connection;
// 	var prints;

// 	connection.on('error', console.error.bind(console, 'connection error:'));
// 	connection.once('open', function () {
// 	    connection.db.collection('prints', function(err, collection){
// 	        collection.find({}).toArray(function(err, data){
// 	        	prints = data;
// 	        })
// 	    });
// 	});

app.listen(5000, function () {
	console.log('App listening on port 5000');
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/art', function(req, res) {
		res.render('art', {printList: printList});
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.post('/inquire', (req, res) => {
	const output = `
		<p style="font-style: italic;">New inquiry:</p>
		<h2 style="margin: 0;">${req.body.name}</h2>
		<h4 style="margin: 0;">${req.body.email}</h4>
		<p>${req.body.message}</p>
	`;

	let mailOptions, transporter;
	transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: inquiryEmail,
			pass: inquiryPassword
		}
	});
	mailOptions = {
		from: req.body.name + ' &lt;' + req.body.email + '&gt;',
		to: inquirySendTo,
		subject: 'New inquiry from mcmello.com',
		html: output
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
	
		res.render('about');
	});
});
