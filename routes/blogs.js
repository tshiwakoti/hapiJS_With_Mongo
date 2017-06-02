'use strict';

const Boom      = require('boom');
const uuid      = require('node-uuid');
const Joi       = require('joi');
const mongojs   = require('mongojs');
const mongo     = mongojs('hapi_With_Mongo', ['blogs']);
// const users     = mongojs('hapi_With_Mongo', ['users']);
const ObjectId  = mongojs.ObjectId;

module.exports = [
  { method: 'GET', path: '/blogs', handler: index }, //,
  { method: 'GET', path: '/blogs/{id}', handler: show },
  { method: 'GET', path: '/blogs/new', handler: newBlog },
  { method: 'POST', path: '/blogs/new', handler: create},
  { method: 'GET', path: '/blogs/{id}/edit', handler: editBlog},
  { method: 'POST', path: '/blogs/{id}', handler: update}
];

function index(request, reply) {
  mongo.blogs.find((err, blogs) => {

    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }
    reply.view('blogs', { blogs: blogs, current_user: request.yar.get('current_user') });
  });
}

function show(request, reply) {
  mongo.blogs.find({_id: ObjectId(request.params.id)}, function (err, blog) {
     reply.view('show', { blog: blog[0], current_user: request.yar.get('current_user') })
  })
}

function newBlog(request, reply) {
  // If user not logged in redirect to log in page else go to create new blog page. 
  var current_user = request.yar.get('current_user');

  if (typeof current_user == 'undefined' || current_user == null) {
    reply.view('login');
  } else {
    reply.view('newBlog', { current_user: current_user })
  }
}

function create(request,reply){
  var createdDate = new Date();
  mongo.blogs.save({
    title: request.payload.title,
    blog: request.payload.blog,
    author: request.yar.get('current_user'),
    createdDate: createdDate
  });
  reply.redirect('/blogs')
}

function editBlog(request, reply) {
  mongo.blogs.find({_id: ObjectId(request.params.id)}, function (err, blog) {
    reply.view('editBlog', { blog: blog[0] })
  })
}

function update(request, reply) {
  console.log('Updating now')
  mongo.blogs.update({_id: ObjectId(request.params.id)}, request.payload, function(err, blog) {
    reply.redirect('/blogs')
  })
}
