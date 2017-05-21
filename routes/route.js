var books = require('./books');
var blogs = require('./blogs');
var users = require('./users');
var about = require('./about');

module.exports = [].concat(books, blogs, users, about);