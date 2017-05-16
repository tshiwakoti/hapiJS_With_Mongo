var books = require('./books');
var blogs = require('./blogs');
var users = require('./users');

module.exports = [].concat(books, blogs, users);