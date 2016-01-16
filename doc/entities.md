# Entities API Documentation

Entities are objects related to a movie which are represented solely by a name. Movie Manager supports a few entities out of the box, specifically the entities returned by the OMDB API: actors, directors, writers, and genres.

Custom extensions may track additional entities with a few steps which are documented in the code sample below.

```js
var MovieManager = require("movie-manager");

// Set entity to the name of the new entity to track
var entity = "foo";

// Modify MovieManager#setup() to create the necessary database tables
MovieManager.prototype.setup = (function(original) {
	return original.call(this)
		.then(() => this.database.namedEntityTable(entity))
		.then(() => this.database.namedEntityRelationTable(entity));
})(MovieManager.prototype.setup);

// Tell the manager to track the entity
MovieManager.setupEntity(entity);
```

*Note: This is all untested, but should work. I'm happy to work through the process and improve it if someone has an actual use case for adding entities.*
