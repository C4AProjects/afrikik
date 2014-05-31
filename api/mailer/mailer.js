'use strict';

var env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    nodemailer = require('nodemailer'),
    path = require('path'),
    templatesDir = path.resolve(__dirname, '..', 'mailer_templates'),
    emailTemplates = require('email-templates');

var EmailAddressRequiredError = new Error('An email address is required');

// create a defaultTransport using gmail and authentication that are
// storeed in the `config.js` file.
var defaultTransport = nodemailer.createTransport("SES",{
    AWSAccessKeyID: config.mailer.AWSAccessKeyID || process.env.AWSAccessKeyID,
    AWSSecretKey:  config.mailer.AWSSecretKey || process.env.AWSSecretKey
});

exports.sendEmail = function (templateName, locals, fn) {
 // make sure that we have an user email
 if (!locals.email) {
   return fn(EmailAddressRequiredError);
 }
 // make sure that we have a message
 if (!locals.subject) {
   return fn(EmailAddressRequiredError);
 }
 emailTemplates(templatesDir, function (err, template) {
   if (err) {
     //console.log(err);
     return fn(err);
   }
   // Send a single email
   template(templateName, locals, function (err, html, text) {
     if (err) {
       //console.log(err);
       return fn(err);
     }
     // if we are testing don't send out an email instead return
     // success and the html and txt strings for inspection
     if (process.env.NODE_ENV === 'test') {
       return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
     }
     /*var transport = defaultTransport;
     transport.sendMail({
       from: config.mailer.defaultFromAddress,
       to: locals.email,
       subject: locals.subject,
       html: html,
       // generateTextFromHTML: true,
       text: text
     }, function (err, responseStatus) {
       if (err) {
         return fn(err);
       }
       return fn(null, responseStatus.message, html, text);
     });*/
     
    var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "contact.afrikik@gmail.com",
        pass: "AfrikikC4A"
        }
    });
    
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Afrikik ✔ <info.afrikik@gmail.com>", // sender address
        to: locals.email, // list of receivers
        forceEmbeddedImages: true,
        subject: locals.subject, // Subject line
        text: text, // plaintext body
        html: html, // html body
        /*attachments: [{
        filename: "logo.png",
        filePath: "/public/img/logo.png",
        cid: "logo@afrikik.logo" 
        }]*/
    }
    
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        return fn(error);
    }else{
        console.log("Message sent: " + response.message);
        return fn(null, response.message, html, text);
    }
    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
    });
     
   });
 });
}