var pluralize = (word) => word + "s";
var ucfirst = (word) => word[0].toUpperCase() + word.substring(1);

exports.pluralize = pluralize;
exports.ucfirst = ucfirst;
