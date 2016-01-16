"use strict";

var Database = require("./database");
var request = require("./request");
var Util = require("./util");

class MovieManager {
	static lookupMovie(title) {
		return request({ t: title });
	}

	static searchMovies(title) {
		return request({ s: title });
	}

	constructor(options) {
		this.options = options;
	}

	init() {
		var options = Object.assign({
			host: "localhost",
			port: 3306,
			database: "movie-manager"
		}, this.options.database);

		this.database = new Database(options);
		return this.database.connect();
	}

	setup() {
		return this.database.createTables();
	}

	addMovie(movie) {
		movie = this.parseMovie(movie);

		return this.saveMovie(movie)
			.then(movieId => Promise.all([
				movieId,
				this.saveGenres({
					movieId: movieId,
					genres: movie.genres
				}),
				this.saveActors({
					movieId: movieId,
					actors: movie.actors
				}),
				this.saveDirectors({
					movieId: movieId,
					directors: movie.directors
				}),
				this.saveWriters({
					movieId: movieId,
					writers: movie.writers
				})
			]))
			.then(values => values[0]);
	}

	parseMovie(movie) {
		return {
			added: movie.added || new Date(),
			imdbId: movie.imdbID,
			imdbRating: movie.imdbRating,
			imdbVotes: movie.imdbVotes,
			plot: movie.plot || movie.Plot,
			poster: movie.poster || movie.Poster,
			rating: movie.rating || movie.Rated,
			releaseDate: movie.releaseDate || new Date(movie.Released),
			runTime: movie.runTime || parseInt(movie.Runtime),
			title: movie.title || movie.Title,

			actors: movie.actors || this.parsePeople(movie.Actors),
			directors: movie.directors || this.parsePeople(movie.Director),
			writers: movie.writers || this.parsePeople(movie.Writer),

			genres: movie.genres || this.parseGroup(movie.Genre),
		};
	}

	parseGroup(group) {
		return group.split(/,\s/g);
	}

	// Example: "Mike Judge (Milton animated shorts), Mike Judge (screenplay)"
	parsePeople(raw) {
		var people = new Set();

		this.parseGroup(raw)

			// Remove parenthesized notes
			.map(person => person.replace(/\s\([^)]+\)/, ""))

			// Remove duplicates by adding to the Set
			.forEach(person => { people.add(person); });

		// Convert back to an array
		return Array.from(people);
	}

	saveMovie(movie) {
		var fields = {};
		[
			"added",
			"imdbId",
			"imdbRating",
			"imdbVotes",
			"plot",
			"poster",
			"rating",
			"releaseDate",
			"runTime",
			"title",
		].forEach(field => fields[field] = movie[field]);

		return this.database.query("INSERT INTO `movies` SET ?", fields)
			.then(data => data.insertId);
	}
}



// Add methods for managing named entities
[
	"actor",
	"director",
	"writer",
	"genre"
].forEach(entity => {
	var pluralName = Util.pluralize(entity);
	var upperSingleName = Util.ucfirst(entity);
	var upperPluralName = Util.ucfirst(pluralName);

	var idProperty = entity + "Id";
	var tableName = pluralName;
	var relationTableName = "movie" + upperPluralName;

	var saveEntitiesMethod = "save" + upperPluralName;
	var ensureEntityMethod = "ensure" + upperSingleName;
	var addEntityToMovieMethod = "add" + upperSingleName + "ToMovie";
	var getEntityIdMethod = "get" + upperSingleName;
	var createEntityMethod = "create" + upperSingleName;

	Object.assign(MovieManager.prototype, {
		[saveEntitiesMethod](data) {
			return Promise.all(
				data[pluralName].map(entityName => this[ensureEntityMethod](entityName))
			)
				.then(entityIds => Promise.all(
					entityIds.map(entityId => this[addEntityToMovieMethod]({
						movieId: data.movieId,
						[idProperty]: entityId
					}))
				));
		},

		[ensureEntityMethod](entityName) {
			return this[getEntityIdMethod](entityName)
				.then(id => id || this[createEntityMethod](entityName));
		},

		[getEntityIdMethod](entityName) {
			return this.database.query(
				"SELECT `id` FROM ?? WHERE `name` = ?",
				[tableName, entityName]
			)
				.then(rows => {
					if (!rows.length) {
						return null;
					}

					return rows[0].id;
				});
		},

		[createEntityMethod](entityName) {
			return this.database.query(
				"INSERT INTO ?? SET `name` = ? " +
					"ON DUPLICATE KEY UPDATE `name` = `name`",
				[tableName, entityName]
			)
				.then(data => data.insertId || this[getEntityIdMethod](entityName));
		},

		[addEntityToMovieMethod](data) {
			return this.database.query(
				"INSERT INTO ?? SET ?",
				[relationTableName, data]
			)
				.then(() => null);
		}
	});
});



module.exports = MovieManager;
