var async = require('async');

module.exports = function(app, passport, auth) {
    //Admin User Routes
    var admins = require('../app/controllers/admin');
    app.get('/admin/signin', admins.signin);
    app.get('/admin/signup', admins.signup);
    app.get('/admin/signout', admins.signout);

     //Setting up the admin users api
    app.post('/admin/users', admins.create);
    /*app.post('/admin/users/session', passport.authenticate('local', {
        failureRedirect: '/admin/signin',
        failureFlash: 'Invalid email or password.'
    }), admins.session);*/
   
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
 
    app.post('/api/v1/users/session', users.login);
    //app.post('/api/v1/users/session', passport.authenticate('local', { }), users.session);
 
    //Setting up the users api
    app.post('/api/v1/users', users.create);    
    app.get('/api/v1/users/:userId/me',  passport.authenticate('bearer', { session: false }), users.me);
    app.get('/api/v1/users/:userId', users.show);
  
    app.get('/logout', users.logout);
    
     //User management flow
    app.get('/users/confirm/:code', users.confirm);
    app.post('/users/reset', users.resetPasswordRequest);
    //app.get('/users/reset/:resetPasswordToken', users.showResetPasswordForm); // Provide a landing page on ELKAPI 
    app.post('/api/v1/users/change/password', users.changePassword); 
    //app.get('/api/v1/users/:userId/smsverificationtoken/:phone', users.sendSmsCode);//Sends a user a SMS verification code
    //app.post('/api/v1/users/:userId/smsverificationtoken', users.verifyBySms); //Verify a SMS code sent to a user
    app.post('/api/v1/users/:userId/emailcode/:email', users.sendEmailCode); //Resend cnfirmation code by email to new registered user


    //Member Routes
    var members = require('../app/controllers/members');
    app.get('/api/v1/users', members.all);
    app.get('/api/v1/users/search/:name', members.searchByName );
    app.post('/api/v1/users/:userId/subscribe/players/:playerId', members.subscribeToPlayer);
    app.post('/api/v1/users/:userId/subscribe/teams/:teamId', members.subscribeToTeam);
    app.get('/api/v1/users/:userId/friends/requests', members.getFriendRequests);
    app.get('/api/v1/users/:userId/players/:playerId/friends', members.getUsersPlayer);
    app.get('/api/v1/users/:userId/teams/:teamId/friends', members.getUsersTeam);
    app.post('/api/v1/users/:userId/approve', members.approveFriendRequest);
    app.post('/api/v1/users/:userId/deny', members.denyFriendRequest);
    app.post('/api/v1/users/:userId/unfollow', members.unfollowFriend);
    
    //Player Routes
    var players = require('../app/controllers/players');
    app.get('/api/v1/players', players.all );
    app.get('/api/v1/players/:playerId', players.show );
    app.post('/api/v1/players/', players.create);
    app.put('/api/v1/players/:playerId', players.update);
    app.del('/api/v1/players/:playerId', players.destroy);
    app.get('/api/v1/players/search/:name', players.searchByName );
    //app.get('/api/v1/players/:playerId/share', players.sharePlayerProfile);
    app.get('/api/v1/users/:userId/teams/:teamId/players', players.getPlayersTeam);
    app.get('/api/v1/search/:name', players.searchPlayersAndTeam)
    app.post('/api/v1/users/:userId/players/:playerId/comment', players.comment); //comment on player profile
    
    app.get('/api/v1/users/:userId/top/items', players.topPlayersAndTeam);
    
    //Team Routes
    var teams = require('../app/controllers/teams');
    app.get('/api/v1/teams', teams.all );
    app.get('/api/v1/teams/:teamId', teams.show );
    app.post('/api/v1/teams', teams.create);
    app.put('/api/v1/teams/:teamId', teams.update);
    app.del('/api/v1/teams/:teamId', teams.destroy);
    app.get('/api/v1/teams/search/:name', teams.searchByName );
    //app.get('/api/v1/teams/:teamId/share', teams.shareTeamProfile);
    app.post('/api/v1/users/:userId/teams/:teamId/comment', teams.comment); //comment on team profile
    
    //Feed Routes
    var feeds = require('../app/controllers/feeds');    
    app.post('/api/v1/users/:userId/feeds', feeds.create);
    //app.post('/api/v1/feeds', feeds.create); // feeds created by web crawler
    app.get('/api/v1/users/:userId/feeds/:feedId', feeds.show);
    app.get('/api/v1/users/:userId/feeds', feeds.all);
    app.get('/api/v1/users/:userId/score/feeds', feeds.scoreFeeds);
    app.get('/api/v1/users/:userId/community/feeds', feeds.communityFeeds);
    app.put('/api/v1/users/:userId/feeds/:feedId', feeds.update);
    app.del('/api/v1/users/:userId/feeds/:feedId', feeds.destroy);
    app.post('/api/v1/users/:userId/feeds/:feedId/comment', feeds.comment); // comment on feed
    app.get('/api/v1/users/:userId/teams/:teamId/feeds', feeds.feedsTeam);
    app.get('/api/v1/users/:userId/players/:playerId/feeds', feeds.feedsPlayer);

    //Notification Routes
    var notifications = require('../app/controllers/notifications');        
    app.get('/api/v1/users/:userId/notifications/:notificationId', notifications.show);
    app.get('/api/v1/users/:userId/notifications', notifications.all);
    app.put('/api/v1/users/:userId/notifications/:notificationId', notifications.setNotificationForUser);
    app.post('/api/v1/users/:userId/feeds/:feedId/notifications', notifications.create);
    
    //Photo Routes
    var photos = require('../app/controllers/photos');        
    app.get('/api/v1/users/:userId/photos/:photoId', photos.download);
    app.post('/api/v1/users/:userId/photos/db', photos.upload); // member profile photo
    app.post('/api/v1/users/:userId/photos', photos.uploadAsFileSystem); // member profile photo
    app.post('/api/v1/admin/photos/users/:userId/teams/:teamId', photos.upload); //team profile photo
    app.post('/api/v1/admin/photos/users/:userId/players/:playerId', photos.upload); //player profile photo
    
    
    //Comment Routes
    var comments = require('../app/controllers/comments');
    app.get('/api/v1/users/:userId/friends/comments', comments.commentsFriends);
    app.get('/api/v1/users/:userId/comments/:commentId', comments.show);
    app.get('/api/v1/users/:userId/feeds/:feedId/comments', comments.getCommentsByFeed);
    app.get('/api/v1/users/:userId/teams/:teamId/comments', comments.getCommentsByTeam);
    app.get('/api/v1/users/:userId/players/:playerId/comments', comments.getCommentsByPlayer);

    //Finish with setting up the userId param
    app.param('userId', users.user); 
    //Finish with setting up the playerId param
    app.param('playerId', players.player);
    //Finish with setting up the teamId param
    app.param('teamId', teams.team);
    //Finish with setting up the feedId param
    app.param('feedId', feeds.feed);
    //Finish with setting up the notificationId param
    app.param('notificationId', notifications.notification)
    //Finish with setting up the photoId param
    app.param('photoId', photos.photo)
    
    //Finish with setting up the commentId param
    app.param('commentId', comments.comment);

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