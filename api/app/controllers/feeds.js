/**
 * This controller is for the Feed object of the API, for security reasons
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Feed = mongoose.model('Feed')
  , Comment = mongoose.model('Comment')

/**
 * Create a new feed
 */
exports.create = function(req, res) {
    var feed = new Feed(req.body)           
    Feed.save(function(err) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Feed creation succeeded!'})
    })
};


/**
 * Update a feed
 */
exports.update = function(req, res){    
    var feed = req.feed
    feed = _.extend(feed, req.body)
    logger.debug("Feed to update %s ", feed)
    Feed.save(function(err, feed) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(feed)
        {
            logger.debug("Feed updated with success")
            res.status(200).json(feed)
        }        
  })
}


/**
 *  Show player
 */
exports.show = function(req, res) {    
    Feed.findOne({
            _id: req.params.feedId
        })
        .exec(function(err, feed) {
            if (err) {
                res.status(500).json( {
                    success:false,
                    error: err
                });
            } else {
                res.json(feed);
            }
    });
   
};


/**
 *  Comment a feed
 */
exports.comment = function(req, res) {
  var comment = new Comment(req.body)           
    comment.save(function(err, comment) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        })
      }
      var feed = req.feed;
      feed.comments.push(comment._id)
      feed.save(function(err){
        if (err) {
          res.status(500).json({
            success:false,
            error: err
          })
        }
        res.status(201).json({succes: true, message:'Feed creation succeeded!'})
      })
    })
}

/**
 *  Remove feed
 */
exports.destroy = function(req, res) {    
    var feed = req.feed;

    feed.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(204).json({message: feed._id.toString() + 'succesfully removed !'});
        }
    });
   
};


/**
 * Find feed by id param
 */
exports.feed = function(req, res, next, id) {
    logger.debug('Feed id parameter: %s', id)
    if(id)
    {
        Feed.findOne({
            _id: new ObjectId(id)
        })
        .exec(function(err, feed) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })}
            if (!feed) 
            {
              res.status(401).json({
                    error:"Invalid feed"
                });
            }
            req.feed = feed;
            next();
        });
    }
    else{
        next();
    }
   
};


