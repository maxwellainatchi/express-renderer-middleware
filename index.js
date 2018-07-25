let Express = require("express");
let fs = require("fs");
let path = require("path");

module.exports = (dir, options) => {
	options = options || {};
	options.vars = options.vars || {};
	let log = (...msgs) => {
		if (options.logging) {
			console.log(...msgs);
		}
	};
	let router = Express.Router();
	router.get("*", (req, res, next) => {
		let url = req.originalUrl;
		let render = file => res.render(file, options.vars);

		// Normalize dir
		dir = dir || req.app.get("views") || "./views";
		if (!path.isAbsolute(dir)) {
			dir = path.normalize(`./${dir}`);
		}

		// Render index
		if (["/", "/index", "/index.html"].includes(url)) {
			log("Rendering index");
			render("./index");
			return;
		}

		// Strip leading and trailing /, and remove .html from URLs
		if (url.charAt(0) === "/") {
			url = url.substring(1);
		}
		if (url.charAt(url.length - 1) === "/") {
			url = url.substring(0, url.length - 1);
		} else if (url.substring(url.length - ".html".length) === ".html") {
			url = url.substring(0, url.length - ".html".length);
		}

		// Check if file exists or index file exists in dir
		if (fs.existsSync(path.normalize(`${dir}/${url}.pug`))) {
			log("Rendering " + url);
			render(url);
		} else if (fs.existsSync(path.normalize(`${dir}/${url}/index.pug`))) {
			log("Rendering " + url + "/index");
			render(`${url}/index`);
		} else {
			next();
		}
	});
	return router;
};
