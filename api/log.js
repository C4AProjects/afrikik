var logger = require('winston');
var Loggly = require('winston-loggly').Loggly;
var loggly_options={ subdomain: "afrikik", inputToken: "getATokenFromLoglly" }
logger.add(logger.transports.File, { filename: "./logs/debug.log", level: 'debug'});
logger.handleExceptions(new logger.transports.File({ filename: './logs/exceptions.log' }))
logger.info('The logs are being captured 3 ways- console, file, and Loggly');
module.exports=logger;