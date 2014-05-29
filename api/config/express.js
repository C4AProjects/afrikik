/**
 * Module dependencies.
 */
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    cors = require('cors')
    helpers = require('view-helpers')
    ;

module.exports = function (app, config, passport) {

  app.set('showStackError', true)
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))
  app.use(express.favicon())
  app.use(express.static(config.root + '/public'))

  // don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'))
  }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    //Enable jsonp
    app.enable("jsonp callback");

    //Enable CORS
    //## CORS middleware
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
        res.send(200);
        }
        else {
        next();
        }

    };

  app.configure(function () {

        //allow cross-domain
        app.use(allowCrossDomain);
        // dynamic helpers
        app.use(helpers(config.app.name))

        // cookieParser should be above session
        app.use(express.cookieParser())

        // bodyParser should be above methodOverride
        app.use(express.bodyParser())
        app.use(express.methodOverride())

        // express/mongo session storage
        app.use(express.session({
          secret: 'AfricanFootballRepresented',
          store: new mongoStore({
            url: config.db,
            collection : 'sessions'
          })
        }))

        // connect flash for flash messages
        app.use(flash())

        //use passport session
        app.use(passport.initialize());
        app.use(passport.session());
        //Set up CORS
        app.use(({origin:"*"})); 
        //routes should be at the last
        app.use(app.router);

        //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
        app.use(function(err, req, res, next) {
            //Treat as 404
            if (~err.message.indexOf('not found')) return next();
            console.log("There was an error somewhere!")
            //Log it to the console
            console.log(err.stack);
            //If this is an Oauth 
            if(err.stack && err.stack.indexOf("Invalid resource owner credentials"))
            {
                res.status(400).json({
                    message:"Unauthorized Access: Invalid resource owner credentials"
                })
            }
            else{
                //Error page
                res.status(500).json({
                    error: err.stack
                });
            }
          
        });

        //Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            console.log("No middleware responded, we'll send a 404" )

            res.status(404).json({
                url: req.originalUrl,
                error: 'Route not found'
            });
        });

        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    });
};
