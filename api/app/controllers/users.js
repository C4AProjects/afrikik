/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('underscore'),
    User = mongoose.model('User'),
    ConfirmCode = mongoose.model('ConfirmCode'),   
    utils = require('../lib/utils'),
    mailer = require("../../mailer/mailer"),
    logger = require('winston'),
    enums = require('../../config/enums').enums,
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    PUBLICLY_VIEWABLE_FIELDS = 'email phone_number username created status user_type profile shop schedule reviews hair'
    
    

var ObjectId = mongoose.Types.ObjectId;


/**
 * Session
 */
exports.session = function(req, res) {   
    req.login(req.body, function(err){
        return res.redirect('/');
    })    
};

/**
 *Login
 */

exports.login = function(req, res){
    var user1 = req.body;
    User.findOne({
        email: user1.email
    })
        .populate('subscribedTeams subscribedPlayers following followers requests')//TODO
        .exec(function(err, user) {
        if (err) {
            res.json({
               alerts:[{message:err}]
            })
        }
        if (!user) {                        
            res.status(403).json( {
                alerts: [{message:'Unknown user'}]
            });
        }
        if (user.status==='P') {
            res.status(403).json( {
                alerts: [{message:'You have to confirm your registration before continuing!'}]
            });
        }
        else if (!user.authenticate(user1.password)) {
            res.status(403).json( {
                alerts: [{message:'Invalid password'}]
            });
        }
        
        else{
            res.json({
               success:true,
               user:user
        })
        }
    });

    
}

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    console.log("Was user added to the request? %j", req.user);
    //If this was a third party login (Facebook, save the token to session)
    if(req.user.token)
    {
        req.session.token = req.user.token;
    }
    if(req.user.refreshToken)
    {
        req.session.refreshToken = req.user.refreshToken;
    }
    res.redirect('/'); 
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {   
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.logout = function(req, res) {
    req.logout();
    req.session.token=undefined;
    req.session.refreshToken=undefined;
    res.json({
        success:true
    })
};

/**
 * Session
 */
exports.session = function(req, res) {   
    req.login(req.user, function(err){
        return res.redirect('/');
    })    
};

/**
 * Register a new user
 */
exports.create = function(req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    
    user.save(function(err, user) 
    {
        if (err) {
            res.json({
                success:false,
                error: err,
            });
        }
        
        confirmcode = new ConfirmCode({code: utils.uid(26), user: user});
            confirmcode.user = user;
            confirmcode.save(function(err){
                if (err) {
                    console.log(err)
                }
        });
        var emailSubject ='Registration to Afrikik';
        email_template = "registration";
        
        var values ={
            email:user.email,
            subject:emailSubject,
            confirmationUrl:req.protocol + "://" + req.get('host') + "/users/confirm/" + confirmcode.code
        }
        mailer.sendEmail(email_template, values, function(err, message, html, text){
            if(err){
                logger.error('error','confirmation email could not be sent to user %s', user.email )
                  res.json({
                    success:true,
                    verificationEmailNotSent:true
                });
            }
            else
            {
                logger.debug("Email Sent! Response Status: %s, html:%s, text:%s", message, html, text)
                res.json({
                    success:true
                });
            }
        })      
 
    });
};

/**
* reset password request if forgotten by sending an email with a reset code
**/
exports.resetPasswordRequest = function(req, res) {
    console.log( req.body );
    User.findOne({
            email: req.body.email                
        })
        .exec(function(err, user) {
            if (err) return next(err);  
            if(!user) return res.status(400).json({success:false,error:'We could not locate a user account for this email address: ' + req.body.email} );
            var confirmcode = new ConfirmCode({code:utils.uid(26), user:user});        
            prepareEmail(confirmcode,{to:req.email, body: email_tpl.reset(confirmcode)}); 
            //Send Reset Password Request email
                var values ={
                    email:user.email,
                    subject:'Password Reset',
                    resetPasswordUrl:req.protocol + "://" + req.get('host') + "/users/reset/" + confirmcode.code
                }
                mailer.sendEmail("password_reset", values, function(err, message, html, text){
                    if(err){
                         debug("Error Sending Email: %s ",err)
                    }
                    debug("Email Sent! Response Status: %s, html:%s, text:%s", message, html, text)
                })                         
            return res.status(200).json({success:true,message: 'An email has been sent to ' + user.email + ' with instructions on how to reset your account.' });
        });
}

/**
* confirm registration by email, or confirm invitation to a vesting
**/
exports.confirm = function(req, res) {
    debug('code param : $s', req.params.code);
    ConfirmCode.findOne({code: req.params.code})
    .populate('user')
    .exec(function(err, confirmcode){
        if(err) return res.status(400).json({errors: err.messages });
        if(!confirmcode) return res.status(400).json({errors: 'This token is no longer valid'  });
        User.findOne({email: confirmcode.user.email, status:'P'})
        .exec(function(err, user){
           if(err) res.status(400).json({errors:err}); 
           user.status = 'A';
           user.save(function(err){
                if(err) res.status(400).json({errors:err});
                 //the confirmation code sent by email
                var values ={
                    email:user.email,
                    subject:'Thank you for registering to Afrikik',
                    androidAppDownloadUrl:config.app.appStore.androidAppDownloadUrl,
                    iOsAppDownloadUrl:config.app.appStore.iOsAppDownloadUrl,
                    appName: config.app.name
                }
                mailer.sendEmail("registration_confirmed", values, function(err, message, html, text){
                    if(err){
                         debug("Error Sending Registration Confirmed Email: %s ",err)
                }
                return res.status(200).json({message:email_tpl.invitation_confirmed(confirmcode)});
           });
           confirmcode.remove();// removing confirm from database
        })
    })
})
}



/**
 * Update a user
 */
exports.update = function(req, res){
    console.dir(req.body)
    var user = req.profile||req.user

    user = _.extend(user, req.body)
    console.log('UPDATED NAME ' +user.name)
    logger.debug("User to update %s ", user)
    user.save(function(err, user2) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(user2)
        {
            logger.debug("WE updated the user")
            res.status(200).json(user2)
        }
        
  })
}

/**
 *  Show profile
 */
exports.show = function(req, res) {    
    res.json(req.user||req.profile)   
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {   
    logger.debug('User id parameter: %s', id)    
    if(id)
    {
        User.findOne({
            _id: new ObjectId(id)
        })
        .populate('subscribedTeams subscribedPlayers following followers requests')//TODO
        .exec(function(err, user) {
            if (err) {
                res.status(401).json({
                    error:err
                });
            }
            if (!user) 
            {
                res.status(401).json({
                    error:"Invalid user"
                });
            }
            req.profile = user;
            req.user = user;
            logger.debug('User successfully set in request %j', user)
            next();
        });
    }
    else{
        next();
    }
   
};

/**
 * Send User
 */
exports.me = function(req, res) {
    logger.debug("ME information loaded for %j", req.user)
    User
        .findOne({
            _id: req.user._id
        })
        .populate('posts postrequests favorites')
        .exec(function(err, user) {
            if (err) res.status(400).json({errors: err });;
            if (!user) res.status(400).json({errors:  'Failed to load User ' + id});
            logger.debug("ME information loaded for %s", user)
            res.json(user || null);
           
        });
    
};


/******************************************************************************************
*           User Registration 
*******************************************************************************************/
/**
* send an email (with a confirm code) to registered user for confirming (lib/utils.js)
**/
var prepareEmail = function(confirmcode, options, send){    
    console.log('Email preparing!!!');    
    if(Math.round(Math.random())<0)return new Error('Sending email failed');    
    
    if(send&&typeof(send)==='function'){
        send(options);// callback sends the email
    }else{
        //sending email with common module notifications
        notification.sendEmail(options);
    }
    
    confirmcode.save(function(err){
        if(err){
            res.status(401).json({
                    error:"Invalid user"
            });
        }
    });
    return;
}


/**
* reset password request if forgotten by sending an email with a reset code
**/
exports.resetPasswordRequest = function(req, res) {
    console.log( req.body );
    User.findOne({
            email: req.body.email                
        })
        .exec(function(err, user) {
            if (err) return next(err);  
            if(!user) return res.status(400).json({success:false,error:'We could not locate a user account for this email address: ' + req.body.email} );
            var confirmcode = new ConfirmCode({code:utils.uid(26), user:user});        
            prepareEmail(confirmcode,{to:req.email, body: email_tpl.reset(confirmcode)}); 
            //Send Reset Password Request email
                var values ={
                    email:user.email,
                    subject:'Password Reset',
                    resetPasswordUrl:req.protocol + "://" + req.get('host') + "/users/reset/" + confirmcode.code
                }
                mailer.sendEmail("password_reset", values, function(err, message, html, text){
                    if(err){
                         logger.debug("Error Sending Email: %s ",err)
                    }
                    logger.debug("Email Sent! Response Status: %s, html:%s, text:%s", message, html, text)
                })                         
            return res.status(200).json({success:true,message: 'An email has been sent to ' + user.email + ' with instructions on how to reset your account.' });
        });
}

/**
* Changing password on a landing page on ELKAPI 
**/
exports.showResetPasswordForm = function(req, res, next){
    ConfirmCode.findOne({code: req.params.resetPasswordToken})
    .populate('user')
    .exec(function(err, token){
        if(err) res.status(500).json({errors: err });
        if(!token) res.status(400).json({errors:'Error in reseting password, you may ready reset it'});
        res.render('users/reset_password', {
            user: token.user,
            resetPasswordToken: req.params.resetPasswordToken // will be put in a hidden input text
        });
    })
}

/**
* Change or reset password
**/
exports.changePassword = function(req, res) {
    var body = req.body;
     User.findOne({_id: new ObjectId(body._id)})
    .exec(function(err0, user) {
        if (err0) res.status(400).json({errors: err0.messages }); 
        if (!user) {
            res.status(400).json({ message: 'Unknown user'});
        }             
        req.login(user, function(err) {
            if (err) return err;
            var token = body.resetPasswordToken || req.params.resetPasswordToken;// may be in a hidden field
            if(token){
                ConfirmCode.findOne({user:user, code: token})
                .exec(function(err, confirmcode){
                    if(err) res.status(400).json({errors: err });
                    //
                    if(body.password){
                        user.password = body.password;
                        user.save(function(err){
                            if(err) res.status(400).json({errors: err });
                            confirmcode.remove(); // Delete the existing ResetPasswordToken
                        });
                    } 
                })
                
            }else{// User is changing his password
                if(user.authenticate(body.oldPassword)){
                    user.password = body.password;
                    user.save(function(err){
                        if(err)res.status(400).json({errors: err });
                    })
                }
            }     
            // Reinitialize Access and Refresh Token

            //end
            return res.status(200).json({message: 'Password changed' });
        });                   
    });
}


/**
* Confirm user registration code sent to them by email
**/


exports.confirm = function(req, res) {
    
     ConfirmCode.findOne({code: req.params.code})
    .populate('user')
    .exec(function(err, confirmcode){
        if(err) return res.status(400).json({errors: err.messages });
        if(!confirmcode) return res.status(400).json({errors: 'This token is no longer valid'  });
        User.findOne({email: confirmcode.user.email, status:'P'})
        .exec(function(err, user){
           if(err) res.status(400).json({errors:err}); 
           user.status = 'A';
           user.save(function(err){
                if(err) res.status(400).json({errors:err});
                 //the confirmation code sent by email
                var values ={
                    email:user.email,
                    subject:'Thank you for registering to Afrikik',
                    androidAppDownloadUrl:config.app.appStore.androidAppDownloadUrl,
                    iOsAppDownloadUrl:config.app.appStore.iOsAppDownloadUrl,
                    appName: config.app.name,
                    appUrl: config.app.appUrl,
                    appDownloadUrl: config.app.appStore.androidAppDownloadUrl
                }
                mailer.sendEmail("registration_confirmed", values, function(err, message, html, text){
                    if(err){
                         logger.debug("Error Sending Registration Confirmed Email: %s ",err)
                }
                return res.redirect('/confirmation/index.html'); //res.status(200).json({message:'Thank you for your registration to AFRIKIK!'});
           });
           confirmcode.remove();// removing confirm from database
        })
    })
})
}

/******************************************************************************************
*           User Verification
*******************************************************************************************/

/**
 * send confirmation code by Email to user registered
 */

exports.sendEmailCode = function(req, res){
    User.findOne({
            _id : new ObjectId(req.params.userId)
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            var confirmcode = new ConfirmCode({code: utils.uid(26), user:user});
            var values ={
                email:user.email,
                subject:'This is a test email from Tonsorious',
                confirmationUrl:req.protocol + "://" + req.get('host') + "/users/confirm/" + confirmcode.code
            }
            mailer.sendEmail("welcome", values, function(err, message, html, text){
                if(err){
                     logger.debug("Error Sending Email: %s ",err);
                    res.status(400).json({success:false, errors: 'Error in sending email ' + err});
                }
                logger.debug("Email Sent! Response Status: %s, html:%s, text:%s", message, html, text)
            });  
            return res.status(200).json({success:true,message: 'An email is sending to ' + user.email });
        });
}


