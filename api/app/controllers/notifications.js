/**
 * This controller is for the Notification object of the API
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Feed = mongoose.model('Feed')
  , Notification = mongoose.model('Notification')
  , logger = require('winston')
  , ObjectId = mongoose.Types.ObjectId

/**
 * Create a new notification for a feed
 *      /users/USER_ID/feeds/FEED_ID/notifications
 *      not really useful for now, because notification is done when activity creation (after feed created)
 *      but we can need to create a specific a feed notification for a specific user
 */
exports.create = function(req, res) {
    var notification = new Notification(req.body)    
    notification.users.addToSet(req.user||req.profile)
    notification._feed = req.feed
    notification.save(function(err) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Notification creation succeeded!'})
    })
};

/**
 * Update a feed, i.e remove the notification for member
 *      /users/USER_ID/notifications/NOTIFICATION_Id
 */
exports.setNotificationForUser = function(req, res){    
    var notification = req.notification
    , user = req.user||req.profile;    
    notification.users.remove(user._id)
    if (notification.users.length==0) {
      notification.remove(function(err){ // Remove the notification object where there is no unnotified member
        if(err) {
          res.status(500).json( {
              success:false,
              error: err
          });
        }
        res.status(200).json({succes: true, message:'Notification read for user!'})
      })
    }
    else
    {
      notification.save(function(err) 
      {
        if(err) {
          res.status(500).json( {
              success:false,
              error: err
          });
        }
        res.status(200).json({succes: true, message:'Notification read for user!'})
      })
    }
}

/**
 *  Show notification
 */
exports.show = function(req, res) {    
   res.status(200).json(req.notification);
};

/**
 *  Get all notifications for a user
 *        /users/USER_ID/notifications
 */
exports.all = function(req, res) {
  var user = req.user||req.profile;
    Notification.find({'users':user._id})
      .populate('_feed')
      .limit(req.query.limit||50)  
      .exec(function(err, list) {
          if (err) {
              res.status(500).json( {
                  success:false,
                  error: err
              });
          } else {
              res.status(200).json(list);
          }
    });
   
};

/**
 *  Remove notification
 */
exports.destroy = function(req, res) {    
    var notification = req.notification;
    notification.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(204).json({message: notification._id.toString() + 'succesfully removed !'});
        }
    });
   
};


/**
 * Find notification by id param
 */
exports.notification = function(req, res, next, id) {
    logger.debug('Notification id parameter: %s', id)
    if(id)
    {
        Notification.findOne({
            _id: new ObjectId(id)
        })
        .populate('_feed')
        .exec(function(err, notification) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })
            }
            if (!notification) 
            {
              res.status(401).json({
                    error:"Invalid notification"
                });
            }
            req.notification = notification;
            next();
        });
    }
    else{
        next();
    }
   
};
