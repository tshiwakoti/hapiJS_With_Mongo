'use strict';

const Hapi    = require('hapi');
const Path    = require('path');
const Hoek    = require('hoek');
const mongojs = require('mongojs');
const Good    = require('good');
const routes  = require('./routes/route');
// const cookie  = require('hapi-auth-cookie')



// Create a server with a host and port
const server  = new Hapi.Server();
server.connection({
  host: 'localhost', 
  port: 3000
});

server.app.db = mongojs('hapi_With_Mongo', ['books']);

var options = {
  storeBlank: false,
  cookieOptions: {
    password: 'supersecretpasswordkaskfhakshfjkasdhfkadshfjklasdhfjkashfjkasdhfkjahsdjfkhasdkjfhasdjkfhajsdkfhjkasdhfjkasdhfjkasdhfjkashfjkahsdfjkhasdkfhaslkdfhaks',
    isSecure: false
  }
};

server.register([
  {
    register: Good,
    register: require('yar'),
    options: options
  },

  require('inert'),
  require('vision')
], function (err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  // server.auth.strategy('base', 'cookie', {
  //   password: 'supersecretpasswordkaskfhakshfjkasdhfkadshfjklasdhfjkashfjkasdhfkjahsdjfkhasdkjfhasdjkfhajsdkfhjkasdhfjkasdhfjkasdhfjkashfjkahsdfjkhasdkfhaslkdfhaks', // cookie secret
  //   cookie: 'app-cookie', // Cookie name
  //   ttl: 24 * 60 * 60 * 1000, // Set session to 1 day,
  //   isSecure: false
  // });

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

