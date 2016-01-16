# Movie Manager

Manage your local movie collection



## Requirements

* Node 4+
* MySQL



## Installation

```sh
npm install movie-manager
```



## Setup

Prior to using the movie manager, you must run a one-time setup to create the database tables.

```js
var MovieManager = require("movie-manager");
var manager = new MovieManager({
	database: {
		user: "movies",
		password: "movies"
	}
});

manager.setup()
	.then(console.log)
	.catch(console.error);
```



## Usage

Once the setup is complete, you can start using the movie manager.

```js
var MovieManager = require("movie-manager");
var manager = new MovieManager({
	database: {
		user: "movies",
		password: "movies"
	}
});

// Initialize the manager
manager.init()

	// Find a movie by title
	.then(() => MovieManager.lookupMovie("Office Space"))

	// Add the movie to the database
	.then(movie => manager.addMovie(movie))

	// Log either the success or failure
	.then(movieId => console.log("Successfully added movie."))
	.catch(error => console.error(error.stack));
```



## API

See the [`doc` directory](doc/) for API documentation.



## License

Copyright Scott González. Released under the terms of the MIT license.
