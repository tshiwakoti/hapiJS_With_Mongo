'use strict';
const Boom 			  = require('boom');
const uuid 			  = require('node-uuid');
const Joi 			  = require('joi');
const mongojs     = require('mongojs');
const Bcrypt 	    = require('bcrypt');
const mongo       = mongojs('hapi_With_Mongo', ['users']);
const blogDB 		  = mongojs('hapi_With_Mongo', ['blogs']);
const SALT_WORK_FACTOR  = 10
const Hapi    = require('hapi');
const server  = new Hapi.Server();
const ObjectId  = mongojs.ObjectId;

module.exports = [
  { method: 'GET',     path: '/users', handler: index },
  { method: 'GET',     path: '/signup', handler: signupPage},
  { method: 'POST',    path: '/signup', handler: signupUser},
  { method: 'GET',     path: '/login', handler: loginForm },
  { method: 'POST',    path: '/login', handler: CreateSession },
  { method: 'GET',     path: '/users/{id}/view', handler: viewUser},
  { method: 'GET',     path: '/users/{id}/edit', handler: editUser},
  { method: 'POST',    path: '/users/{id}', handler: updateUser},
  { method: 'GET',     path: '/users/logout', handler: Logout},
  { method: 'POST',    path: '/users/{id}/delete', handler: destroyUser }
];

function index(request, reply) {
  mongo.users.find((err, docs) => {

    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }
    reply.view('usersView', {users: docs, current_user: request.yar.get('current_user') });
  });
}

function editUser(request, reply) {
  mongo.users.find({_id: ObjectId(request.params.id)}, function (err, user) {
    reply.view('editUser', { user: user[0], current_user: request.yar.get('current_user')})
  })
}

function destroyUser(request, reply){
  //console.log('Destroy ', request.params.id)
  //var toDestroyBlogs = blogDB.blogs.find({ "author.email" : user[0].email });
  //toDestroyBlogs.remove({_id: ObjectId(request.params.id)});
  
  mongo.users.remove({_id: ObjectId(request.params.id)}, function(err, user) {
    console.log(user)

    if(err) {
      console.log(err)
    } else {
      request.yar.set('current_user', null)
      blogDB.blogs.remove({ "author._id" : ObjectId(request.params.id) })
      reply.view('login');
    }
  })
}
/*
function viewUser(request, reply) {
   mongo.users.find({_id: ObjectId(request.params.id)}, function (err, user) {
      blogDB.blogs.find({ "author.email" : user[0].email }, function (err, blogs) {
        console.log(blogs)
        reply.view('viewUser', {
          user: user[0],
          current_user: request.yar.get('current_user'),

          blogs: blogs
        })
      })
   })
}
*/

function viewUser(request, reply) {
   mongo.users.find({_id: ObjectId(request.params.id)}, function (err, user) {
      blogDB.blogs.find({ "author.email" : user[0].email }, function (err, blogs) {
        console.log(blogs)
        reply.view('viewUser', {
          user: user[0],
          current_user: request.yar.get('current_user'),
          blogs: blogs
        })
      })
   })
}

function updateUser(request, reply) {
  console.log('Updating user')
  mongo.users.findAndModify({
    query: { _id: ObjectId(request.params.id) },
    update: {
      $set: {
        firstName: request.payload.firstName,
        lastName:  request.payload.lastName,
      }
    }
  }, function (err, user, lastErrorObject) {
    console.log('err', err)
    console.log('user', user)
    console.log('lastErrorObject', lastErrorObject)
  })
  
  reply.redirect('/blogs')
}

function signupPage(request,reply){
  reply.view('signupView');
}

function signupUser(request,reply){
  Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    Bcrypt.hash(request.payload.password, salt, function(err, hash) {
      if (err) return next(err);

      console.log('Sign in user Email- ', request.payload.email)
      mongo.users.save({
        email: request.payload.email,
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        password: hash
      })
    });
  });
  reply.redirect('/login')
}

function loginForm(request, reply) {
  reply.view('login');
}

function CreateSession(request, reply) {
  mongo.users.find({ email: request.payload.email }, function (err, user) {
    user = user[0]

    //if(err) return next(err);
    if(!user) {
      return reply.view('login', { error: 'Email does not exist' });
    }


    Bcrypt.compare(request.payload.password, user.password, function(err, res) {
      if(res) {
        request.yar.set('current_user', user);
        // res.session.user = user[0];
        reply.redirect('/blogs')
      } else {
        //console.log('User not found')
        return reply.view('login', { error: 'Password does not Match. Please login Again.' });
      }
    });
  })
}

function Logout(request, reply) {
  request.yar.set('current_user', null)
  reply.redirect('/blogs')
}
