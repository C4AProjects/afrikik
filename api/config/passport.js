var mongoose = require('mongoose'),
    logger = require('winston'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    GoogleStrategy = require('passport-google-oauth').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    User = mongoose.model('User'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    AccessToken = mongoose.model('AccessToken'),
    RequestToken = mongoose.model('RequestToken'),
    RefreshToken = mongoose.model('RefreshToken'),
    OAuthClient = mongoose.model('OAuthClient');


module.exports = function(passport, config) {
    //Serialize sessions
    passport.serializeUser(function(authCredentials, done) {
        if(authCredentials.user)
        {
            return  done(null,authCredentials.user._id);
        }
        done(null, authCredentials.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            console.log("Local Strategy");
            //var regEmail = new regExp('([a-z0-9]{3,}@[a-z0-9]{3,}.[a-z0-9]{2,4})')
            //if(email.match(/regEmail))            
            if(email.indexOf('@')!==-1){                
                User.findOne({
                    email: email
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {                        
                        return done(null, false, {
                            message: 'Unknown user'
                        });
                    }
                    if (!user.authenticate(password)) {
                        return done(null, false, {
                            message: 'Invalid password'
                        });
                    }
                    return done(null, user);
                });

            }
            else //looking for by username
            {
                UserProfile.findOne({
                    username: email
                })
                .populate('_user')
                .exec(function(err, profile) {
                    if (err) {
                        return done(err);
                    }
                    if (!profile) {
                       
                        return done(null, false, {
                            message: 'Unknown username'
                        });
                    }
                    if (!profile._user.authenticate(password)) {
                        return done(null, false, {
                            message: 'Invalid password'
                        });
                    }
                    return done(null, profile);
                });

            }
            
        }
    ));

    // Use basic strategy for OAuth
    passport.use(new BasicStrategy(function (clientKey, clientSecret, done) {
         console.log("Basic Strategy")
        logger.debug('BaS: clientKey: %s, clientSecret: %s', clientKey, clientSecret);
        OAuthClient.findOne({ clientKey: clientKey, clientSecret: clientSecret }, function (err, client) {
            logger.debug('Found clientKey: %s, clientToken: %s, err: %s, client: %s', clientKey, clientSecret, err, client);
            if (err) return done(err);
            if (!client) return done(null, false);
            return done(null, client);
        });
    }));

    // Use client password strategy for OAuth2 clients
    passport.use(new ClientPasswordStrategy(function (clientKey, clientToken, done) {
         console.log("CPS Strategy")
        logger.debug('CPS: key: %s, token: %s', clientKey, clientToken);
        OAuthClient.findOne({ clientKey: clientKey, clientSecret: clientToken }, function (err, client) {
            logger.debug('CPS: client: %s, err: %s', client, err);
            if (err) return done(err);
            if (!client) return done(null, false);
            return done(null, client);
        });
    }));

    // Use bearer strategy
    passport.use(new BearerStrategy(function (accessToken, done) {
        logger.debug('BeS: accessToken: %s', accessToken);

        AccessToken.findOne({ token: accessToken }, function (err, token) {
            if (err) return done(err);
            if (!token) return done(null, false, {message:'no token exists for this user!'});

            if(Math.round((Date.now() - token.created)/1000) > config.security.tokenLife){
                AccessToken.remove({token: accessToken}, function(err){
                    if(err) return done(err);
                });
                 logger.debug('BeS: token expired: %s', token);
                return done(null, false, {message:'Token expired'});
            }

            logger.debug('BeS: token retrieved: %s', token);
            User.findOne({ _id: token.user}, function (err, user) {
                logger.debug('BeS: found matching user: %s, err: %s', user, err);
                if (err) return done(err);
                if (!user) return done(null, false, {message: 'User not registered!'});
                var info = {scope: '*'}
                return done(null, user, info);
            });
        });
    }));

    //Use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({
                'twitter.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        provider: 'twitter',
                        twitter: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    //Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'email': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
            
                var currentConfig = config;
                var clientKey = currentConfig.security.clientKey;
                var clientSecret = currentConfig.security.clientSecret;
                var tokenLife = currentConfig.security.tokenLife;
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'facebook',
                        facebook: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                       
                        //Find the current client
                        OAuthClient.findOne({ clientKey: clientKey, clientSecret: clientSecret }, function (err, client) {
                            logger.debug('Found Client: client: %s, err: %s', client, err);
                            if (err) return done(err);
                            if (!client) return done(null, false);
                             //Add tokens for this user
                            var authCredentials = {
                                token: accessToken,
                                user: user,
                                client: client,
                                created: new Date()
                            };
                            var refreshTokenValue = refreshToken;
                            var token = new AccessToken(authCredentials);
                            var refreshToken = new RefreshToken({token: refreshTokenValue, client: client, user:user});

                            refreshToken.save(function(err){
                              if(err) { done(err); }
                            });

                            token.save(function (error, result) {
                                logger.debug('Facebook exchange.password: access_token: %s, error: %s', result, error);
                                if (error) return done(error);
                                authCredentials.refreshToken = refreshToken
                                authCredentials.expires_in  = tokenLife;
                                authCredentials.id = user._id;
                                logger.debug('user to return:  %s', authCredentials);
                                return done(err, authCredentials);
                            });
                        });
                       
                    });
                } 
                else {
                    console.log("Found an existing facebook user");
                    //Add tokens for this user
                    //ensure to remove all refresh and access token
                   
                 
                    //Find the current client
                    OAuthClient.findOne({ clientKey: clientKey, clientSecret: clientSecret }, function (err, client) {
                        logger.debug('Found Client: client: %s, err: %s', client, err);
                        if (err) return done(err);
                        if (!client) return done(null, false);
                        var authCredentials = {
                            token: accessToken,
                            user: user,
                            client: client,
                            created: new Date()
                        };
                        //ensure to remove all refresh and access token
                        RefreshToken.remove({user: user, client: client}, function(err){
                           if(err) return done(err);
                        });

                        AccessToken.remove({user: user, client: client}, function(err){
                          if(err) return done(err);
                        });
                        var refreshTokenValue = refreshToken;
                        var token = new AccessToken(authCredentials);
                        var refreshToken = new RefreshToken({token: refreshTokenValue, client: client, user:user});

                        refreshToken.save(function(err){
                          if(err) { done(err); }
                        });

                        token.save(function (error, result) {
                            logger.debug('Facebook exchange.password: access_token: %s, error: %s', result, error);
                            if (error) return done(error);
                            authCredentials.refreshToken = refreshToken
                            authCredentials.expires_in  = tokenLife;
                            authCredentials.id = user._id;
                            logger.debug('user to return:  %s', authCredentials);
                            return done(err, authCredentials);
                        });
                    });
                    return done(err, user);
                }
            });
        }
    ));

    //Use github strategy
    passport.use(new GitHubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'github.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'github',
                        github: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    //Use google strategy
    passport.use(new GoogleStrategy({
            consumerKey: config.google.clientID,
            consumerSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {           
            User.findOne({
                'email': profile.id
            }, function(err, user) {                
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'google',
                        google: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));
    
   

};