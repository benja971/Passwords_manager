const express = require('express');
const useragent = require('express-useragent');
const fileUpload = require('express-fileupload');
const compression = require('compression');
const https = require('https');

const fs = require('fs');
const ip = require('ip');

const route = require('./route');
const { colors, log } = require('./console');

require('dotenv').config();

const package = require('../package.json');
const manifest = require('../public/manifest.json');

// // // // // // // // // // // // // // //

// Show app header
{
	const dev_mode = process.env.NODE_ENV === 'development';
	const app_url = dev_mode || !manifest ? `https://${ip.address()}` : manifest.related_applications[0].url;
	const package_name = package.name.replace(/^./, str => str.toUpperCase());

	// Clear console
	console.clear();

	// Show running mode
	console.log(`\n${dev_mode ? colors.yellow : colors.green}Running in ${dev_mode ? 'development' : 'production'} mode${colors.white}`);

	// Show package name and version
	console.log(`${package_name} version ${colors.green}${package.version}${colors.white}`);

	// Show app url
	console.log(`Available at ${colors.blue}${app_url}${colors.white}\n`);
}

// // // // // // // // // // // // // // //

// Reserving connexion only to fr-FR during dev (may block apple devices)
const authorized_countries = ['fr-FR'];

// Get the language and country of a request (ex: 'fr-FR')
const getCountry = req => {
	const acclang = req.headers['accept-language'];
	return acclang ? acclang.slice(0, 2) + '-' + acclang.slice(3, 5).toUpperCase() : 'N/A';
};

// App
const app = express();

// Basic middlewares
{
	app.use(compression());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(useragent.express());
	app.use(fileUpload());

	// Filter and log connections
	app.use(async (req, res, next) => {
		const ip = req.ip?.replace('::ffff:', '').replace('::1', 'localhost').replace('127.0.0.1', 'localhost');
		const country = getCountry(req);

		const authorized = authorized_countries.includes(country);
		const device = req.useragent.isMobile ? 'mobile' : 'desktop';
		const secure = req.hostname === 'localhost' || req.protocol === 'https' || process.env.HTTPS_PORT === 'NULL';
		const file = req.url.split('/').slice(-1)[0];

		// Only log navigation requests
		const signifiant = !file.includes('.');

		// if connection logs are enabled and the request is significant
		if (process.env.LOG_CONNECTIONS == 1 && signifiant) {
			// yellow for http, green for https, red for refused and blue for auth credentials.
			let color = 'red';
			if (authorized) color = secure ? 'green' : 'yellow';

			// Log connection
			log(` > ${ip} (${country}, ${device}, ${req.hostname})`, color);
		}

		if (!secure) res.redirect(`https://${req.hostname}${req.url}`);
		else if (authorized) next();
	});
}

route(app);

// // // // // // // // // // // // // // //

// HTTP
if (process.env.HTTP_PORT !== 'NULL') {
	app.listen(process.env.HTTP_PORT, () => {
		console.log(`${colors.yellow}http${colors.white} server listening...`);
	});
}

// HTTPS
if (process.env.HTTPS_PORT !== 'NULL') {
	const options = {
		key: fs.readFileSync('./cert/private_key.key'),
		cert: fs.readFileSync('./cert/ssl_certificate.cer')
	};

	https.createServer(options, app).listen(process.env.HTTPS_PORT, () => {
		console.log(`${colors.green}https${colors.white} server listening...`);
	});
}
