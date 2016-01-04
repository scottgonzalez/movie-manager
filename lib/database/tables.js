var Util = require("../util");

var tables = {
	createTables() {
		return this.createMoviesTable()
			.then(() => this.createActorsTable())
			.then(() => this.createMovieActorsTable())
			.then(() => this.createDirectorsTable())
			.then(() => this.createMovieDirectorsTable())
			.then(() => this.createWritersTable())
			.then(() => this.createMovieWritersTable())
			.then(() => this.createGenresTable())
			.then(() => this.createMovieGenresTable())
			.then(() => null);
	},

	dropTables() {
		return Promise.all(
			[
				"movieActors",
				"movieDirectors",
				"movieWriters",
				"movieGenres",
				"movies",
				"actors",
				"directors",
				"writers",
				"genres",
			].map(table => this.query("DROP TABLE ??", [table]))
		)
			.then(() => null);
	},

	namedEntityTable(entity) {
		var pluralName = Util.pluralize(entity);

		return this.query(
			`CREATE TABLE ?? (
				\`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				\`name\` VARCHAR(255) NOT NULL UNIQUE KEY
			) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
			[pluralName]
		);
	},

	namedEntityRelationTable(entity) {
		var pluralName = Util.pluralize(entity);
		var tableName = "movie" + Util.ucfirst(pluralName);
		var columnName = entity + "Id";

		return this.query(
			`CREATE TABLE ?? (
				\`movieId\` INT UNSIGNED,
				?? INT UNSIGNED,

				FOREIGN KEY (\`movieId\`)
					REFERENCES \`movies\`(\`id\`)
					ON DELETE CASCADE,

				FOREIGN KEY (??)
					REFERENCES ??(\`id\`)
					ON DELETE CASCADE
			) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
			[tableName, columnName, columnName, pluralName]
		);
	},

	createMoviesTable() {
		return this.query(
			`CREATE TABLE \`movies\` (
				\`added\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				\`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				\`title\` VARCHAR(255) NOT NULL,
				\`imdbId\` VARCHAR(15),
				\`rating\` VARCHAR(5),
				\`releaseDate\` TIMESTAMP,
				\`runTime\` INT UNSIGNED,
				\`plot\` TEXT,
				\`imdbRating\` DECIMAL(2,1),
				\`imdbVotes\` INT UNSIGNED,
				\`poster\` VARCHAR(255)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8`
		);
	},

	createActorsTable() {
		return this.namedEntityTable("actor");
	},

	createMovieActorsTable() {
		return this.namedEntityRelationTable("actor");
	},

	createDirectorsTable() {
		return this.namedEntityTable("director");
	},

	createMovieDirectorsTable() {
		return this.namedEntityRelationTable("director");
	},

	createWritersTable() {
		return this.namedEntityTable("writer");
	},

	createMovieWritersTable() {
		return this.namedEntityRelationTable("writer");
	},

	createGenresTable() {
		return this.namedEntityTable("genre");
	},

	createMovieGenresTable() {
		return this.namedEntityRelationTable("genre");
	}
};

module.exports = tables;
