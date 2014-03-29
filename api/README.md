Afrikik API
================

ExpressJS application running the Afrikik API 

##Host configuration
On your machine, create a new local host configuration (etc/hosts)

```
127.0.0.1 	localapi.afrikik.com
````
If you get a message stating "uncaughtException: listen EADDRNOTAVAIL" it's because
you have not local host configuration for localapi.afrikik.com

###Required technologies
Make sure to have Node installed. Currently the project uses
- Node v0.10.20
- npm v1.3.11
- Bower v1.2.8 


### Post cloning Setup
You need accounts from the following to run this
-MongoLab To host your mongoDB application
-Heroku To Deploy your application in production and staging
-Amazon AWS as this api uses Amazon SES for emailing. You are welcome to configure it using any other provider like Mandrill etc
-Twilio, if you would like to send SMS notifications
-Loggly: if you want to support server side logging
-Social Networks: You'll need to create apps on Facebook, Twitter, LinkedIn and Github and obtain the appropriate keys and tokens to enable login and api calls from those networks

All configurations options are in api/app/config/config.js

Set it up appropriately for each of your running environments (Dev, Test, Production)

In test and production, it is more secure to specify those configurations as Environment Variables when starting the app.

#### Setup Environment Tools
Install NodeJS

#### Install NPM and Bower Dependancies
Once the project is checked out, run from within afriki/api
```
npm install
bower install
```


#### Launch Server

Once all the modules are installed, launch the nodemon server. 

Development environment, from within afriki/api:
```
NODE_ENV=development grunt
```

#### REMEMBER TO WRITE YOUR UNIT TEST, THIS IS A TDD PROJECT, ANY NEW FEATURE SHOULD BE CHECKED IN WITH ITS CORRESPONDING TEST





