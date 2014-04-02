var async = require('async');

module.exports = function(app, passport, auth) {
    //Admin User Routes
    var admins = require('../app/controllers/admin');
    app.get('/admin/signin', admins.signin);
    app.get('/admin/signup', admins.signup);
    app.get('/admin/signout', admins.signout);


     //Setting up the admin users api
    app.post('/admin/users', admins.create);
    app.post('/admin/users/session', passport.authenticate('local', {
        failureRedirect: '/admin/signin',
        failureFlash: 'Invalid email or password.'
    }), admins.session);
    app.get('/admin/users/me', admins.me);
    app.get('/admin/users/:userId', admins.show);
     //AdminClient Routes
    var clients = require('../app/controllers/clients');
    app.get('/admin/clients', clients.all);
    app.post('/admin/clients', auth.requiresLogin, clients.create);
    app.get('/admin/clients/:clientId', clients.show);
    app.put('/admin/clients/:clientId', auth.requiresLogin, auth.client.hasAuthorization, clients.update);
    app.del('/admin/clients/:clientId', auth.requiresLogin, auth.client.hasAuthorization, clients.destroy);


     //Admin User Routes
    var users = require('../app/controllers/users');

    //Setting up the users api
    app.post('/api/v1/users', users.create);
    app.get('/api/v1/users/:userId/me',  passport.authenticate('bearer', { session: false }), users.me);
    app.get('/api/v1/users/:userId', users.show);
    app.post('/api/v1/users/:userId/likes/:postId',passport.authenticate('bearer', { session: false }), users.add_like);
    
    app.get('/logout', users.logout);

     //Post Routes
    var posts = require('../app/controllers/posts');
    app.get('/api/v1/posts', posts.all);
    app.post('/api/v1/posts', passport.authenticate('bearer', { session: false }), posts.create);
    app.get('/api/v1/posts/:postId', posts.show);
    app.put('/api/v1/posts/:postId',  posts.update);
    app.del('/api/v1/posts/:postId', passport.authenticate('bearer', { session: false }), posts.destroy);

     //Post Request Routes
    var postRequests = require('../app/controllers/post_requests');
    app.get('/api/v1/postrequests', postRequests.all);
    app.post('/api/v1/postrequests', postRequests.create);
    app.get('/api/v1/postrequests/:postRequestId', postRequests.show);
    app.put('/api/v1/postrequests/:postRequestId', passport.authenticate('bearer', { session: false }),  postRequests.update);
    app.post('/api/v1/postrequests/:postRequestId/resolve/:userId', passport.authenticate('bearer', { session: false }), postRequests.resolve);
    app.del('/api/v1/postrequests/:postRequestId', passport.authenticate('bearer', { session: false }), postRequests.destroy);

    
    //Finish with setting up the userId param
    app.param('userId', users.user);
    //Finish with setting up the postId param
    app.param('postId', posts.post);
     //Finish with setting up the postRequestId param
    app.param('postRequestId', postRequests.postRequest);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/'
    }), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);
    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/'
    }), users.signin);
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/',
        scope: 'https://www.google.com/m8/feeds'
    }), users.signin);
    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/',
        scope: 'https://www.google.com/m8/feeds'
    }), users.authCallback);
   

   
  
    // Set up OAuth2 routes handling
    var oauth2 = require('./middlewares/oauth2');
    app.post('/oauth/token', oauth2.token);

    //Finish with setting up the clientId param
    app.param('clientId', clients.client);

    //Home route
    var apiIndex = require('../app/controllers/index');
    app.get('/', apiIndex.index);
    app.get('/admin', admins.render);

};