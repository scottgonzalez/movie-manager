"use strict";

var Mysql = require("mysql");
var tables = require("./database/tables");

class Database {
	constructor(options) {
		this.connection = Mysql.createConnection(options);
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.connection.connect((error) => {
				if (error) {
					return reject(error);
				}

				resolve();
			});
		});
	}

	query(query, values) {
		return new Promise((resolve, reject) => {
			this.connection.query(query, values, (error, result) => {
				if (error) {
					return reject(error);
				}

				resolve(result);
			});
		});
	}
}

Object.assign(Database.prototype, tables);

module.exports = Database;
