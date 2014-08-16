/**
 * This controller is for the Feed object of the API, for security reasons
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Feed = mongoose.model('Feed')
  , Comment = mongoose.model('Comment')
  , logger = require('winston')
  , ObjectId = mongoose.Types.ObjectId
  , Notification = mongoose.model('Notification')

/**
 * Create a new feed
 */

function sortByDate(f1, f2) {
     return f2.createdAt.getTime() - f1.createdAt.getTime()
}
exports.create = function(req, res) {
    var feed = new Feed(req.body)
  
    if (req.user||req.profile) {
      feed._user = req.user||req.profile
    }
    feed.save(function(err, feed) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Feed creation succeeded!', feed:feed})
    })
    /***** Notification part *****/
    //Notify all subscribed users
    var User = mongoose.model('User')
    if (feed._team) {//team activity
      User.find({'subscribedTeams':feed._team},{_id:1})
      .exec(function(err, list){
        if (err) {
          res.status(500).json({error: err});
        }
        var notification = new Notification({})
        notification._feed = feed
        notification.users = list
        notification.save(function(err, notification) 
        {
          if (err) {
            res.status(500).json({error: err});
          }
          logger.debug("Notification done %s ", notification)
        })
      })
    }
    else //player activity
    {
      User.find({'subscribedPlayers':feed._player},{_id:1})
      .exec(function(err, list){
        if (err) {
          res.status(500).json({error: err});
        }
        var notification = new Notification({})
        notification._feed = feed
        notification.users = list
        notification.save(function(err, notification) 
        {
          if (err) {
            res.status(500).json({error: err});
          }
          logger.debug("Notification done %s ", notification)
        })
      })
    }
};


/**
 * Update a feed
 */
exports.update = function(req, res){    
    var feed = req.feed
    feed = _.extend(feed, req.body)
    logger.debug("Feed to update %s ", feed)
    feed.save(function(err, feed) {
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
 *  Show feed
 */
exports.show = function(req, res) {    
   res.status(200).json(req.feed);
};


/**
 *  Comment a feed
 */
exports.comment = function(req, res) {
  var comment = new Comment(req.body)
  comment._user = req.user
  comment._feed = req.feed
  comment.username = req.user.name||req.user.username
  comment.save(function(err, comment) 
  {
    if(err) {
      res.status(500).json({
          success:false,
          error: err
      })
    }
    var feed = req.feed;
    if (feed.comments == null) {
      feed.comments = []
    }
    feed.comments.push(comment._id)
    feed.save(function(err){
      if (err) {
        res.status(500).json({
          success:false,
          error: err
        })
      }
      res.status(201).json({succes: true, message:'Comment done!'})
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
        .slice('comments', req.query.limit||-10)  //the last 10 comments if limit 
        .populate('comments')
        .exec(function(err, feed) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })
            }
            if (!feed) 
            { 
              res.status(401).json({
                    error:"Invalid feed"
                });
            }else{                
                feed.comments.sort(sortByDate)
            }
            req.feed = feed;
            next();
        });
    }
    else{
        next();
    }
   
};


/*******************************************************************************
 *     Get feeds on a player /players/PLAYER_ID/feeds
 *********************************************************************************/

exports.feedsPlayer = function(req, res){
  Feed.find({'_player': req.player._id, 'feedType': {$ne: 'community'}})
  .populate('_user _player _team comments')
  .sort('-publish_date')
  .sort('-createdAt')
  .skip(req.query.skip||0)
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

/*******************************************************************************
 *     Get feeds on a team /teams/TEAM_ID/feeds
 *********************************************************************************/

exports.feedsTeam = function(req, res){
  Feed.find({'_team': req.team._id, 'feedType': {$ne: 'community'}})
  .populate('_user _player _team comments')
  .sort('-publish_date')
  .sort('-createdAt')
  .skip(req.query.skip||0)
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

/*********************************************************************************
 *  Get all last feeds related to subscribed Players or teams   /feeds
 *********************************************************************************/


exports.all = function(req, res){
  var q = {$or:[{'_player': {$in: req.user.subscribedPlayers}},{'_team': {$in: req.user.subscribedTeams}}],'feedType': {$ne: 'community'}}
  if (req.user.isAdmin) {
    q = {'feedType': {$ne: 'community'}}
  }
Feed.find(q)
  .populate('_user _player _team comments')
  .sort('-publish_date')
  .sort('-createdAt')
  .skip(req.query.skip||0)
  .limit(req.query.limit||50)
  .exec(function(err, list){
    if(err) {
      res.status(500).json({
        success:false,
        error: err
      })
    }
    res.status(200).json(list)
  })
}

/*********************************************************************************
 *  Get all last feeds related to subscribed Players or teams   /feeds type Score
 *********************************************************************************/

exports.scoreFeeds = function(req, res){
  Feed.find({/*'_player': {$in: req.user.subscribedPlayers},*/ 'feedType':'score'})
  .populate('_user comments')
  .sort('-publish_date')
  .sort('-createdAt')
  .skip(req.query.skip||0)
  .limit(req.query.limit||50)
  .exec(function(err, list){
    if (err) {
      res.status(500).json( {
        success:false,
        error: err
      })
    }
    //list.sort(sortByDate)
    res.status(200).json(list)
  })
}

exports.communityFeeds = function(req, res){
  Feed.find({/*'_player': {$in: req.user.subscribedPlayers},*/ 'feedType':'community'})
  .populate('_user _player _team comments')
  .sort('-publish_date')
  .sort('-createdAt')
  .skip(req.query.skip||0)
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
