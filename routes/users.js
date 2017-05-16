'use strict';

const Boom 			  = require('boom');
const uuid 			  = require('node-uuid');
const Joi 			  = require('joi');
const mongojs     = require('mongojs');
const Bcrypt 	    = require('bcrypt');
const mongo 		  = mongojs('hapi_With_Mongo', ['users']);
const SALT_WORK_FACTOR  = 10
const Hapi    = require('hapi');
const server  = new Hapi.Server();

module.exports = [
  { method: 'GET', path: '/users', handler: index },
  { method: 'GET', path: '/signup', handler: signupPage},
  { method: 'POST', path: '/signup', handler: signupUser},
  { method: 'GET', path: '/login', handler: loginForm },
  { method: 'POST', path: '/login', handler: CreateSession }
];

function index(request, reply) {
  mongo.users.find((err, docs) => {

    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }

    console.log('Current user ', request.yar.get('current_user'))

    reply.view('usersView', {users: docs, current_user: request.yar.get('current_user') });
  });
}

function signupPage(request,reply){
  reply.view('signupView');
}

function signupUser(request,reply){
  Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    Bcrypt.hash(request.payload.password, salt, function(err, hash) {
      if (err) return next(err);

      mongo.users.save({
        email: request.payload.email,
        password: hash
      })
    });
  });

  reply.redirect('/users')
}

function loginForm(request, reply) {
  reply.view('loginForm');
}

// function CreateSession(request, reply) {
//   mongo.users.find({ email: request.payload.email }, function (err, user) {
//     console.log(request.auth)
//     console.log(request.auth.session)
//     //request.auth.session.set(user);
//     reply('Logged in');
//   })
// }
function CreateSession(request, reply) {
  console.log('Form Password- ', request.payload.password)
  mongo.users.find({ email: request.payload.email }, function (err, user) {
    user = user[0]

    Bcrypt.compare(request.payload.password, user.password, function(err, res) {
      if(res) {
        request.yar.set('current_user', user);
        reply.redirect('/users')
      } else {
        console.log('User not found')
      }
    });
  })
}
