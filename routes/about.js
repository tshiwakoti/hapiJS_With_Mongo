'use strict';

const Boom 			= require('boom');
const uuid 			= require('node-uuid');
const Joi 			= require('joi');
const mongojs 	= require('mongojs');
const mongo 		= mongojs('hapi_With_Mongo', ['books']);

module.exports = [
  { method: 'GET', path: '/about', handler: about }
];

function about(request, reply) {
  reply.view('about', {current_user: request.yar.get('current_user')});
}
