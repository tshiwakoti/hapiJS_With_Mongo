'use strict';

const Boom 			= require('boom');
const uuid 			= require('node-uuid');
const Joi 			= require('joi');
const mongojs 	= require('mongojs');
const mongo 		= mongojs('hapi_With_Mongo', ['books']);

module.exports = [
  { method: 'GET', path: '/books', handler: index },
  { method: 'GET', path: '/books/{id}', handler: show },
  { method: 'POST', path: '/books', handler: create },
];

function index(request, reply) {
  mongo.books.find((err, docs) => {

    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }
    //reply.view('books', { books: docs, users: [ { name: 'Puru' }, { name: 'Abhi'} ] });
    reply.view('books', {books: docs});
  });
}

function show(request, reply) {
  reply('books show')
}

function create(request, reply) {
  console.log('------------------')
  console.log(request)
  console.log('------------------')
  reply('books created')
}