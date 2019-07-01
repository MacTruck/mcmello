const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var inquiryEmail = config.inquiryEmail;
var inquiryPassword = config.inquiryPassword;
var inquirySendTo = config.inquirySendTo;

// Connect to the database

	var url = config.serverUrl;

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

app.listen(5000, function () {
	console.log('App listening on port 5000');
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/art', function(req, res) {
		res.render('art', {prints: prints});
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.post('/inquire', (req, res) => {
	const output = `
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name: ${req.body.name}</li>
			<li>Email: ${req.body.email}</li>
		</ul>
		<h3>Message</h3>
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
