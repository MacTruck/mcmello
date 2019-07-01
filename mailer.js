const nodemailer = require('nodemailer'),
	mailCredentials = require('./mailCredentials'),
	transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: mailCredentials.user,
			password: mailCredentials.password
		}
	}),
	EmailTemplate = require('email-templates').EmailTemplate,
	path = require('path'),
	Promise = require('bluebird');

let users = [{}];

function sendEmail (obj) {
	return transporter.sendMail(obj);
}

function loadTemplate (templateName, contexts) {
	let template = new.EmailTemplate(path.join(__dirname, 'templates', templateName));
	return Promise.all(contexts.map(context) => {
		return new Promise((resolve, reject) => {
			template.render(context, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		});
	});
}