var debug = require('debug')('authorization'),
     enums = require('../enums').enums;

/**
/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.type('json');
        return res.send(401,{message:"Unauthorized access"});
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.redirect('/users/' + req.profile.id);
        }
        next();
    },
   
};

/**
 * Client authorizations routing middleware
 */
exports.client = {
    hasAuthorization: function(req, res, next) {
        next();
    }
};
