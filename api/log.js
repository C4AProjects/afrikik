var logger = require('winston');
var Loggly = require('winston-loggly').Loggly;
var loggly_options={ subdomain: "afrikik", inputToken: "getATokenFromLoggly" }
logger.add(Loggly, loggly_options);
console.log('Deployment Environment is %s', process.env.NODE_ENV )
if(process.env.NODE_ENV == "development")
{
	logger.add(logger.transports.File, { filename: "./logs/debug.log", level: 'debug'});
	logger.info('The logs are being captured 3 ways- console, file, and Loggly');
}
module.exports=logger;