"use strict";

var Util = require("./util");

class Query {
	constructor(manager) {
		this.manager = manager;
		this.fields = ["`movies`.*"];
		this.conditions = [];
		this.queriedEntities = new Set();
		this.values = [];
	}

	where(field, value) {
		return this.manager.constructor.entities.indexOf(field) !== -1 ?
			this.whereEntity(field, value) :
			this.equal(field, value);
	}

	equal(field, value) {
		this.conditions.push("?? = ?");
		this.values.push(field, value);

		return this;
	}

	greaterThan(field, value) {
		this.conditions.push("?? > ?");
		this.values.push(field, value);

		return this;
	}

	lessThan(field, value) {
		this.conditions.push("?? < ?");
		this.values.push(field, value);

		return this;
	}

	whereEntity(entity, name) {
		var pluralName = Util.pluralize(entity);
		var upperPluralName = Util.ucfirst(pluralName);

		// Generate database table and property names
		var idProperty = entity + "Id";
		var tableName = pluralName;
		var relationTableName = "movie" + upperPluralName;

		var groupConcat = `GROUP_CONCAT(DISTINCT \`${tableName}\`.\`name\` SEPARATOR ", ")`;

		// Get list of related entities
		this.fields.push(`(
			SELECT ${groupConcat}
			FROM \`${tableName}\`
			INNER JOIN \`${relationTableName}\`
				ON \`${relationTableName}\`.\`${idProperty}\` = \`${tableName}\`.\`id\`
			WHERE \`${relationTableName}\`.\`movieId\` = \`movies\`.\`id\`
		) AS \`${pluralName}\``);

		// Limit movies based on the entity
		this.conditions.push(`\`${tableName}\`.\`name\` = ?`);
		this.values.push(name);

		this.queriedEntities.add(entity);

		return this;
	}

	addEntity(entity) {
		var pluralName = Util.pluralize(entity);
		var tableName = pluralName;

		var groupConcat = `GROUP_CONCAT(DISTINCT \`${tableName}\`.\`name\` SEPARATOR ", ")`;
		this.fields.push(`${groupConcat} AS \`${pluralName}\``);

		return this;
	}

	exec() {

		// Queries always contain all of the entities.
		// Some of the entities may already exist in the query
		// because they're being used to filter the results.
		// Add any entities which don't already exist.
		this.manager.constructor.entities.forEach(entity => {
			if (!this.queriedEntities.has(entity)) {
				this.addEntity(entity);
			}
		});

		var whereClause = !this.conditions.length ? "" :
			("WHERE " + this.conditions.join(" AND "));

		var query =
			`SELECT ${this.fields.join(",\n")}
			FROM \`movies\`
			INNER JOIN \`movieActors\`
				ON \`movieActors\`.\`movieId\` = \`movies\`.\`id\`
			INNER JOIN \`actors\`
				ON \`actors\`.\`id\` = \`movieActors\`.\`actorId\`
			INNER JOIN \`movieDirectors\`
				ON \`movieDirectors\`.\`movieId\` = \`movies\`.\`id\`
			INNER JOIN \`directors\`
				ON \`directors\`.\`id\` = \`movieDirectors\`.\`directorId\`
			INNER JOIN \`movieGenres\`
				ON \`movieGenres\`.\`movieId\` = \`movies\`.\`id\`
			INNER JOIN \`genres\`
				ON \`genres\`.\`id\` = \`movieGenres\`.\`genreId\`
			INNER JOIN \`movieWriters\`
				ON \`movieWriters\`.\`movieId\` = \`movies\`.\`id\`
			INNER JOIN \`writers\`
				ON \`writers\`.\`id\` = \`movieWriters\`.\`writerId\`
			${whereClause}
			GROUP BY \`movies\`.\`id\``;

		return this.manager.database.query(query, this.values);
	}
}



module.exports = Query;
