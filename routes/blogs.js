'use strict';

const Boom      = require('boom');
const uuid      = require('node-uuid');
const Joi       = require('joi');
const mongojs   = require('mongojs');
const mongo     = mongojs('hapi_With_Mongo', ['blogs']);
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
  // If user not logged in redirect to log in page. 
  reply.view('newBlog')
}

function create(request,reply){
  // Add blog.author to loggein User
  // Add created Date.
  console.log(request.payload)
  var createdDate = new Date();
  console.log(createdDate);
  //mongo.blogs.save(request.payload);
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
