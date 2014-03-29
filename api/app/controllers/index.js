/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore'),
   logger = require('winston');


exports.index = function(req, res) {
     //res.sendfile( './public/app/index.html');
     console.log("Rendering user template with user: %j, token:%j, refreshToken:%j ", req.user, req.session.token, req.session.refreshToken)
    if(req.token)
    {
        console.dir(req.session.token);
    }
    if(req.refreshToken)
    {
        console.dir(req.session.refreshToken);
    }
     res.render('client', {
        user: req.user ? JSON.stringify(req.user) : 'undefined',
        token:req.session.token ? req.session.token : 'undefined',
        refreshToken:req.session.refreshToken ?  JSON.stringify(req.session.refreshToken) : 'undefined'
    })
};