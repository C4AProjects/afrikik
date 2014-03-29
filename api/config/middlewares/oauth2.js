var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    utils = require('../../app/lib/utils'),
    RequestToken = mongoose.model('RequestToken'),
    AccessToken = mongoose.model('AccessToken'),
    RefreshToken = mongoose.model('RefreshToken'),
    OAuthClient = mongoose.model('OAuthClient'),
    User = mongoose.model('User'),
    logger = require('winston'),
    //logger=require('mean-logger'),
    config = require('../config')

// create OAuth 2.0 server
var server = oauth2orize.createServer();

server.serializeClient(function (client, done) {
    return done(null, client._id);
});

server.deserializeClient(function (id, done) {
    OAuthClient.findOne({ _id: id }, function (error, client) {
        if (error) return done(error);
        return done(null, client);
    });
});

server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
    logger.debug('grant.code: client: %s, user: %s, redirectUri: %s', client, user, redirectUri);
    var code = utils.uid(16),
        doc = {
            code: code,
            user: user,
            client: client,
            redirectUri: redirectUri,
            created: new Date()
        };
    var token = new RequestToken(doc);
    token.save(function (error, result) {
        logger.debug('grant.code: error: %s, result: %s', error, result);
        if (error) return done(error);
        done(null, code);
    });
}));

server.grant(oauth2orize.grant.token(function (client, user, ares, done) {
    logger.debug('grant.token: client: %s, user: %s', client, user);
}));

server.exchange(oauth2orize.exchange.code(function (client, request_token, redirectUri, done) {
    logger.debug('exchange.code: client: %s, request_token: %s, redirectUri: %s', client, request_token, redirectUri);
    RequestToken.findOne({ client: client, code: request_token, redirectUri: redirectUri }, function (error, token) {
        logger.debug('exchange.code: id: %s, request_token: %s, error: %s, token: %s', client._id, request_token, error, token);
        if (error) return done(error);
        if (!token) return done(null, false);
        var uid = utils.uid(62),
            doc = {
                token: uid,
                user: token.user,
                client: token.client,
                created: new Date()
            };
        var token = new AccessToken(doc);
        token.save(function (error, result) {
            logger.debug('exchange.code: access_token: %s, error: %s', result, error);
            if (error) return done(error);
            done(null, uid);
        });
    });
}));

server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
   logger.debug('exchange.password: client: %s, username: %s, password: %s, scope: %s', client, username, password, scope);
    User.findOne({ email: username }).select('+hashed_password').select('+salt').exec(function (error, user) {
        console.log('found user: %s', user);
        if (error) return done(error);
       
        if(user && user.authenticate(password))
        {   
            //ensure to remove all refresh and access token
            RefreshToken.remove({user: user, client: client}, function(err){
               if(err) return done(err);
            });

            AccessToken.remove({user: user, client: client}, function(err){
              if(err) return done(err);
            });
            var uid = utils.uid(256)
            , doc = {
                token: uid,
                user: user,
                client: client,
                created: new Date()
            };
            var currentConfig = config[process.env.NODE_ENV || 'development'];
            var tokenLife = currentConfig.security.tokenLife;
            var refreshTokenValue = utils.uid(62);
            var token = new AccessToken(doc);
            var refreshToken = new RefreshToken({token: refreshTokenValue, client: client, user:user});

            refreshToken.save(function(err){
              if(err) { done(err); }
            });

            token.save(function (error, result) {
                logger.debug('exchange.password: access_token: %s, error: %s', result, error);
                if (error) return done(error);
                doc.refreshToken = refreshToken
                doc.expires_in  = tokenLife;
                 logger.debug('user to return:  %s', user);
                done(null, doc);
            });
        }
        else
        {
            
            return done(null, false,{message: 'Invalid Resource Owner' });
        }
       
    });

}));

// Exchange refreshToken for access token
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done){
  RefreshToken.findOne({token: refreshToken}, function(err, token){
    if(err){ return done(err);}
    if(!token) { return done(null, false);}

    User.findById(token.userID, function(err, user){
      if(err){ return done(err); }
      if(!user){ return done(null, false); }

      RefreshToken.remove({user: user, client: client}, function(err){
        if(err) return done(err);
      });

      AccessToken.remove({user: user, client: client}, function(err){
        if(err) return done(err);
      });

      var tokenValue = utils.uid(62);
      var refreshTokenValue = utils.uid(62);
      var token = new AccessToken({token: tokenValue, client: client, user: user});
      var refToken = new RefreshToken({token: refreshTokenValue, client: client, user:user});

      refToken.save(function(err){
        if(err) { done(err); }
      });
      var currentConfig = config[process.env.NODE_ENV || 'development'];
      var tokenLife = currentConfig.security.tokenLife;

      token.save(function(err, token){
        if(err) { return done(err); }
        done(null, tokenValue, refreshTokenValue, {'expires_in': tokenLife, 'scope':scope });
      });
      
    })
  })

}));

exports.authorization = server.authorization(function (clientKey, redirectUri, done) {
    logger.debug('authorization: ', clientKey, redirectUri);
    OAuthClient.findOne({ clientKey: clientKey }, function (error, client) {
        logger.debug('authorization: ', error, client);
        if (error) return done(error);
        return done(null, client, redirectUri);
    });
});

exports.token = [
    passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }),
    server.token(),
    server.errorHandler({ mode: 'indirect' })
];

exports.server = server;
