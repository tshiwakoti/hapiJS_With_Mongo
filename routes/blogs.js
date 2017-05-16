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
  { method: 'POST', path: '/blogs', handler: create},
  { method: 'GET', path: '/blogs/{id}/edit', handler: editBlog},
  { method: 'POST', path: '/blogs/{id}', handler: update}
  //{ method: 'GET', path: '/users', handler: index }
];

function index(request, reply) {
  mongo.blogs.find((err, blogs) => {

    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }
    reply.view('blogs', { blogs: blogs });
  });
}

function show(request, reply) {
  reply('blogs show')
}

function newBlog(request, reply) {
  reply('new blog')
}

function create(request,reply){
  console.log(request.payload)
  mongo.blogs.save(request.payload);
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
