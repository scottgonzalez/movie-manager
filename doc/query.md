# Query API Documentation

The `Query` class provides a fluent interface for searching through the movie database. The `Query` class is exposed as `MovieManager.Query`, but an instance can also be created from a `MovieManager` instance via `MovieManager#find()`.



## Constructor

### `Query(manager)`

* `manager` (`MovieManager`): The `MovieManager` instance to query.



## Instance Methods

### `where(field, value)`

Limits the query based on a field or entity. This is just a convenience method which delegates to `Query#equal()` or `Query#whereEntity()` based on the provided field.

* `field` (`String`): The field or entity to filter on.
* `value` (Mixed): The value to filter on.

### `equal(field, value)`

Limits the query based on an exact match for a field's value.

* `field` (`String`): The field to filter on.
* `value` (Mixed): The value to match.

### `greaterThan(field, value)`

Limits the query based on the value for a field being greater than a threshold.

* `field` (`String`): The field to filter on.
* `value` (Mixed): The value to compare against.

### `lessThan(field, value)`

Limits the query based on the value for a field being less than a threshold.

* `field` (`String`): The field to filter on.
* `value` (Mixed): The value to compare against.

### `whereEntity(entity, name)`

Limits the query based on a related entity.

* `entity` (`String`): The entity to filter on.
* `name` (`String`): The name of the entity to filter on.

### `exec()`

Executes the query.

Returns a promise which resolves when the query is complete.
