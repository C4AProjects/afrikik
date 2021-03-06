/**
 * This controller is for the Feed object of the API, for security reasons
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Comment = mongoose.model('Comment')
  , logger = require('winston')
  , ObjectId = mongoose.Types.ObjectId


/**
 * Get comments of a feed
 */
exports.getCommentsByFeed = function(req, res){
  Comment
    .find({_feed:req.feed._id})
    .limit(req.query.limit||50)  
    .exec(function(err, list) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.json(list);
        }
  });
}

/**
 * Get comments of a team
 */
exports.getCommentsByTeam = function(req, res){
  Comment
    .find({_team:req.team._id})
    .limit(req.query.limit||50)  
    .exec(function(err, list) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.json(list);
        }
  });
}

/**
 * Get comments of a player
 */
exports.getCommentsByPlayer = function(req, res){
  Comment
    .find({_player:req.player._id})
    .limit(req.query.limit||50)  
    .exec(function(err, list) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.json(list);
        }
  });
}

/**
 *  Show Comment
 */
exports.show = function(req, res) {    
   res.status(200).json(req.comment);
};

/**
 * Find comment by id param
 */
exports.comment = function(req, res, next, id) {
    logger.debug('Comment id parameter: %s', id)
    if(id)
    {
        Comment.findOne({
            _id: new ObjectId(id)
        })
        .exec(function(err, comment) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })
            }
            if (!comment) 
            {
              res.status(401).json({
                    error:"Invalid comment"
                });
            }
            req.comment = comment;
            next();
        });
    }
    else{
        next();
    }
   
};
