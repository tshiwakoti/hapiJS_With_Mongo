'use strict';

const Hapi    = require('hapi');
const Path    = require('path');
const Hoek    = require('hoek');
const mongojs = require('mongojs');
const Good    = require('good');
const routes  = require('./routes/route');

// Create a server with a host and port
const server  = new Hapi.Server();
server.connection({
  host: 'localhost', 
  port: 3000
});

server.app.db = mongojs('hapi_With_Mongo', ['books']);

server.register([
  {
    register: Good,
  },

  require('inert'),
  require('vision'),
], function (err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }
  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});

server.views({
    engines: { ejs: require('ejs') },
    relativeTo: __dirname,
    path: 'templates',
    compileOptions: {
      pretty: true
    }
});

server.route(routes);

