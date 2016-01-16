# MovieManager API Documentation

The `MovieManager` class contains methods for managing your movie collection as well as looking up movies via the [Open Movie Database (OMDB) API](http://www.omdbapi.com/).



## Static Methods

A few static methods are provided for querying the OMDB API. It is not necessary to create a `MovieManager` instance or run the one-time setup prior to using the static methods.

### `MovieManager.lookupMovie(title)`

Finds a movie by title. Returns the best match if there are multiple results.

* `title` (`String`): The title of the movie to search for

Returns a promise which resolves to an OMDB result. See the [OMDB API examples](http://omdbapi.com/#examples) or just use `MovieManager.lookupMovie()` to see the format of the result.

### `MovieManager.searchMovies(title)`

Find movies based on a title search. Returns many movies.

* `title` (`String`): The title to search for

Returns a promise which resolves to an array of OMDB results.



## Constructor

### `MovieManager(options)`

* `options` (`Object`)
	* `database` (`Object`): The MySQL database settings
		* `server` (`String`; default: `"localhost"`): The hostname of the database server
		* `port` (`Number`; default: `3306`): The port number to connect to
		* `user` (`String`): The MySQL user to authenticate as
		* `password` (`String`): The password of the supplied user
		* `database` (`String`; default: `"movie-manager"`): Which database to connect to



## Instance Methods

### `MovieManager#setup()`

Sets up the database by creating the necessary tables.

Returns a promise which resolves when the database has been set up.

### `MovieManager#init()`

Initializes the manager by establishing a database connection.

Returns a promise which resolves when the initialization is complete and the instance may be used.

### `MovieManager#addMovie(movie)`

Adds a movie to the database.

* `movie` (`Object`): An OMDB result *or* an object containing the following properties:
	* `added` (`Date`; default: `new Date()`): When the movie was added to the database
	* `imdbId` (`String`): The IMDB ID of the movie
	* `imdbRating` (`Number`): The IMDB rating
	* `imdbVotes` (`Number`): The number of votes on IMDB
	* `plot` (`String`): A short description of the plot
	* `poster` (`String`): URL for the movie poster
	* `rating` (`String`): MPAA rating
	* `releaseDate` (`Date`): When the movie was released
	* `runTime` (`Number`): The run time of the movie in minutes
	* `title` (`String`): The title
	* `actors` (`Array`): Major actors and actresses
	* `directors` (`Array`): The directors
	* `writers` (`Array`): The writers
	* `genres` (`Array`): The genres

### `MovieManager#find()`

Initializes a `Query` instance for searching through the movie database. See the [`Query` documentation](query.md) for details on how to use configure the search.

Returns a new `Query` instance.

### `MovieManager#findAll()`

Finds all movies in the database.

Returns a promise which resolves when all movies have been returned from the database.



## Properties

### `entities`

An array of all entities related to a movie. See the [entities documentation](entities.md) for more details.
