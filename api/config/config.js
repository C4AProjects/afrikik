var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    };
var mongoConfig={};
if(process.env.NODE_ENV == "development")
{
     //MongoLab configuration
    mongoConfig = {
            "hostname":"ds037047.mongolab.com",
            "port":"37047",
            "username":"afrikik",
            "password":"K1ckY0urBum",
            "name":"",
            "db":"afrikik"
    }



}

var getEnvironmentMongoConfig =  function (){
    var config = {};
     //Heroku config
    if(getenv("MONGOLAB_URI")){
            return getenv("MONGOLAB_URI");
    }
    //MongoHQ Config
    if(getenv("MONGOHQ_URL")){
        return getenv("MONGOHQ_URL");
    }
    //Appfog configuration
    if(process.env.VCAP_SERVICES)
    {
        var appFogEnv = JSON.parse(process.env.VCAP_SERVICES);
        if(appFogEnv)
        {
             mongoConfig = appFogEnv['mongodb-1.8'][0]['credentials'];
             return mongoConfig;
        }  
    }
}
var generate_mongo_url = function(mongoUrlConfig){
    if(typeof mongoUrlConfig == "object")
    {
          mongoUrlConfig.hostname = (mongoUrlConfig.hostname || 'localhost');
            mongoUrlConfig.port = (mongoUrlConfig.port || 27017);
            mongoUrlConfig.db = (mongoUrlConfig.db ||process.env.MONGODB_AFRIKIK_DB || 'afrikik');
	    mongoUrlConfig.username = (mongoUrlConfig.username||process.env.MONGODB_AFRIKIK_USER)
	    mongoUrlConfig.password = (mongoUrlConfig.password||process.env.MONGODB_AFRIKIK_PWD)
            
            if(mongoUrlConfig.username && mongoUrlConfig.password){
                return "mongodb://" + mongoUrlConfig.username + ":" + mongoUrlConfig.password + "@" + mongoUrlConfig.hostname + ":" + mongoUrlConfig.port + "/" + mongoUrlConfig.db;
            }else{
                return "mongodb://" + mongoUrlConfig.hostname + ":" + mongoUrlConfig.port + "/" + mongoUrlConfig.db;
            }
    }
    else
    {
        return mongoUrlConfig;
    }
  
}

if(process.env.NODE_ENV == "test" || process.env.NODE_ENV == "production")
{
    mongoConfig = getEnvironmentMongoConfig();
}

var mongourl = generate_mongo_url(mongoConfig);

module.exports = {
   
    development: {   
         security:{
            tokenLife:7200,
            clientKey:'Afrikik2014',
            clientSecret:'F00tb@llIsK1ng1NAfriAY3s'
        },
        notifier: notifier,
        db: mongourl,
        root: rootPath,
        mailer:{
            AWSAccessKeyID: "CreateAnAmazonAWSAccessKeyAndAddItHere",
            AWSSecretKey: "CreateAnAmazonAWSSecretKeyAndAddItHere",
            defaultFromAddress: 'Afrikik.com <kick@afrikik.com>',
            auth:{
                user:'GetAmazonSESAuthCredentials',
                pass:'GetAmazonSESAuthCredentials'
            }
            
        },
        appStore:{
            androidAppDownloadUrl:"http://api.afrikik.com",
            iOsAppDownloadUrl:"http://api.afrikik.com"
        },
        app: {
            name: 'Afrikik.mobi Dev',
            app_port:2014,
            appUrl: 'http://localapi.afrikik.com:' + this.app_port,
            appStore:{
                androidAppDownloadUrl:"http://api.afrikik.com",
                iOsAppDownloadUrl:"http://api.afrikik.com"
            }
        },
        facebook: {
            clientID: "GetAFacebook",
            clientSecret: "bcddf21436a9ac1e4f1512d8ea7b6517",
            callbackURL: "http://apilocal.afrikik.com:2014/auth/facebook/callback"
        },
        twitter: {
            clientID: "GetATwitterClientId",
            clientSecret: "GetATwitterClientSecret",
            callbackURL: "http://localapi.afrikik.com:4000/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localapi.afrikik.com:2014/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localapi.afrikik.com:2014/auth/google/callback"
        }
       
         
    },
    test: {  
        security:{
            tokenLife: 3600
        },
        notifier: notifier,
        db: mongourl,
        root: rootPath,
        
        mailer:{
            AWSAccessKeyID: "CreateAnAmazonAWSAccessKeyAndAddItHere",
            AWSSecretKey: "CreateAnAmazonAWSSecretKeyAndAddItHere",
            defaultFromAddress: 'Afrikik.com <kick@afrikik.com>',
            auth:{
                user:'GetAmazonSESAuthCredentials',
                pass:'GetAmazonSESAuthCredentials'
            }
            
        },
        appStore:{
            androidAppDownloadUrl:"http://api.afrikik.com",
            iOsAppDownloadUrl:"http://api.afrikik.com"
        },
        app: {
            name: 'Afrikik Staging API',
            app_port:2014,
            appUrl: 'http://afrikik.heroku.com',
            appStore:{
                androidAppDownloadUrl:"http://api.afrikik.com",
                iOsAppDownloadUrl:"http://api.afrikik.com"
            }
        },
        facebook: {
            clientID: "615784181833749",
            clientSecret: "bcddf21436a9ac1e4f1512d8ea7b6517",
            callbackURL: "http://local.nouchi.mobi:2014/auth/facebook/callback"
        },
        twitter: {
            clientID: "GetATwitterClientId",
            clientSecret: "GetATwitterClientSecret",
            callbackURL: "http://localapi.afrikik.com:2014/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localapi.afrikik.com:2014/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localapi.afrikik.com:2014/auth/google/callback"
        }
    
       
    },
    production: {  
        security:{
            tokenLife:14400
        },
	    notifier: notifier,
        db: mongourl,
        root: rootPath,
        mailer:{
            AWSAccessKeyID: "CreateAnAmazonAWSAccessKeyAndAddItHere",
            AWSSecretKey: "CreateAnAmazonAWSSecretKeyAndAddItHere",
            defaultFromAddress: 'Afrikik.com <kick@afrikik.com>',
            auth:{
                user:'GetAmazonSESAuthCredentials',
                pass:'GetAmazonSESAuthCredentials'
            }
            
        },
        appStore:{
            androidAppDownloadUrl:"http://api.afrikik.com",
            iOsAppDownloadUrl:"http://api.afrikik.com"
        },
        app: {
            name: 'Afrikik API',
            app_port:2014,
            appUrl: 'http://api.afrikik.com',
            appStore:{
                androidAppDownloadUrl:"http://api.afrikik.com",
                iOsAppDownloadUrl:"http://api.afrikik.com"
            }
        },
        facebook: {
            clientID: "615784181833749",
            clientSecret: "bcddf21436a9ac1e4f1512d8ea7b6517",
            callbackURL: "http://local.nouchi.mobi:2014/auth/facebook/callback"
        },
        twitter: {
            clientID: "GetATwitterClientId",
            clientSecret: "GetATwitterClientSecret",
            callbackURL: "http://localapi.afrikik.com:2014/auth/twitter/callback"
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://localapi.afrikik.com:2014/auth/github/callback'
        },
        google: {
            clientID: "APP_ID",
            clientSecret: "APP_SECRET",
            callbackURL: "http://localapi.afrikik.com:2014/auth/google/callback"
        }
       
    }
};
