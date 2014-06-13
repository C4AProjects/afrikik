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
    .find({'_feed': req.params.thefeedId})
    .populate('_team _player _user')
    .sort('-createdAt')
    .skip(req.query.skip||0)
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

/*****************************************************************************
 *  Get comments of friends user /comments
 *****************************************************************************/

exports.commentsFriends = function(req, res){
  Comment.find({'_user': {$in: req.user.following}})
  .populate('_feed _player _team')
  .limit(req.query.limit||50)
  .exec(function(err, list){
    if (err) {
      res.status(500).json( {
        success:false,
        error: err
      })
    }
    res.status(200).json(list)
  })
}

