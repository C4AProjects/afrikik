/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    os = require("os");
    logger = require('./log.js');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose')


var Grid = require('gridfs-stream');
var fs = require('fs'),
    gfs = null

//Bootstrap db connection
var db = mongoose.connect(config.db).connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  gfs = Grid(db.db, mongoose.mongo);
  gridfs = require('./app/lib/gridfs')
  gridfs.gfs = gfs
  console.log(config.app.name + " MongoDB Instance is running at: " + config.db);
});

//process.exit(0)

//Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function(file) {
    require(models_path + '/' + file);
});

//bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

//express settings
require('./config/express')(app, config, passport);

//Bootstrap routes
require('./config/routes')(app, passport, auth);

//Start the app by listening on <port>
var port = process.env.PORT || process.env.VCAP_APP_PORT || 2014;
if(process.env.NODE_ENV == "development")
{
    app.listen(port,'localapi.afrikik.com');
}
else
{
     app.listen(port);
}

console.log(config.app.name + 'API started at http://' + os.hostname() + ":" + port + "/");

//Initializing logger 
//logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;