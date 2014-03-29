/**
 * This controller is for the admin section of your API, for security reasons, it will use the regular
 * jade engine rendering to render you pages and hide away any business logic
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')


exports.render = function(req, res){
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : "null"
  })

} 

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
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
exports.signout = function(req, res) {
    req.logout();
    res.json({
        success:true
    });
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
    var user = new User(req.body),
    confirmcode = new ConfirmCode({code: utils.uid(26), user:user});
    user.provider = 'local';
    user.status=enums.userStatusOptions.REGISTERED_USER_STATUS;
    if(!user.user_type)
    {
        user.user_type=enums.userTypeOptions.CUSTOMER_USER_TYPE
    }
    user.save(function(err) 
    {
        if (err) {
            return res.json({
                success:false,
                error: err,
            });
        }
        confirmcode.user = user;
        confirmcode.save(function(confirmationCode){
            if (err) {
                return res.json({
                    success:false,
                    error: err,

                });
            }
        })
        //the confirmation code sent by email depending on the type of user
        var emailSubject ='Welcome to Tonsorious!';
        email_template = "welcome";
        logger.debug("comparing %s to %s", user.user_type,enums.userTypeOptions.BARBER_USER_TYPE)
        if(user.user_type ==  enums.userTypeOptions.BARBER_USER_TYPE)
        {
            emailSubject ='Welcome to Tonsorious, your hair business is about to reach the next level!';
            email_template = "welcome_barber";
        }
        var values ={
            email:user.email,
            subject:emailSubject,
            confirmationUrl:req.protocol + "://" + req.get('host') + "/users/confirm/" + confirmcode.code
        }
        mailer.sendEmail(email_template, values, function(err, message, html, text){
            if(err){
                logger.error('error','confirmation email could not be sent to user %s', user.email )
                  return res.json({
                    success:true,
                    verificationEmailNotSent:true
                });
            }
            logger.debug("Email Sent! Response Status: %s, html:%s, text:%s", message, html, text)
            return res.json({
                success:true
            });
        })      
 
    });
};


/**
 * Update a user
 */
exports.update = function(req, res){
    console.dir(req.body)
    var user = req.profile

    user = _.extend(user, req.body)
    logger.debug("User to update %s ", user)
    user.save(function(err, user) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(user)
        {
            logger.debug("WE updated the user")
            res.status(200).json(user)
        }
        
  })
}

/**
 *  Show profile
 */
exports.show = function(req, res) {
    var populate=req.query.populate||"profile";
    User
    .findOne({
            _id: req.params.userId
        })
    .populate(populate).exec(function(err, user) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.json(user);
        }
    });
   
};

/**
 * Send User
 */
exports.me = function(req, res) {
  
    User
        .findOne({
            _id: req.user._id
        })
        .populate('customers servicers appointments')
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            logger.debug("ME information loaded for %s", user)
            res.json(user || null);
           
        });
    
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
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) 
            {
                return res.status(401).json({
                    error:"Invalid user"
                });
            }
            req.profile = user;
            next();
        });
    }
    else{
        next();
    }
   
};


