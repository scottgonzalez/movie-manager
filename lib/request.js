"use strict";

var Http = require("http");
var Querystring = require("querystring");

var request = (query) => {
	return new Promise((resolve, reject) => {
		var request = Http.request({
			hostname: "www.omdbapi.com",
			path: "/?" + Querystring.stringify(query)
		}, (response) => {
			if (response.statusCode >= 400) {
				return reject(new Error(Http.STATUS_CODES[response.statusCode]));
			}

			var data = "";
			response.setEncoding("utf8");
			response.on("data", (chunk) => {
				data += chunk;
			});
			response.on("end", () => {
				try {
					data = JSON.parse(data);
				} catch (error) {
					return reject(error);
				}

				if (data.Response === "False") {
					return reject(new Error(data.Error));
				}

				resolve(data);
			});
		});

		request.on("error", reject);
		request.end();
	});
};

module.exports = request;
