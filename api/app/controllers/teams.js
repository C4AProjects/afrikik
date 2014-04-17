/**
 * This controller is for the Team object of the API
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Team = mongoose.model('Team')
  , logger = require('winston')
  , ObjectId = mongoose.Types.ObjectId
  ,  Comment = mongoose.model('Comment')

/**
 * Create a new team
 */
exports.create = function(req, res) {
    var team = new Team(req.body)           
    team.save(function(err, team) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      else{
        res.status(201).json({succes: true, message:'Team creation succeeded!', item: team})
      }
    })
};


/**
 * Update a team
 */
exports.update = function(req, res){    
    var team = req.team
    team = _.extend(team, req.body)
    logger.debug("Team to update %s ", team)
    team.save(function(err, team) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(team)
        {
            logger.debug("Team updated with success")
            res.status(200).json(team)
        }        
  })
}

/**
 *  Show team
 */
exports.show = function(req, res) {    
    res.json(req.team)
   
};

/**
 *  Get all players
 */
exports.all = function(req, res) {
    Team.find({})
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
   
};


/**
 *  Remove team
 */
exports.destroy = function(req, res) {    
    var team = req.team;
    team.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(204).json({message: team.name + 'succesfully removed !'});
        }
    });
   
};


/**
 * Find team by ID param
 */
exports.team = function(req, res, next, id) {
    logger.debug('Team id parameter: %s', id)
    if(id)
    {
        Team.findOne({
            _id: new ObjectId(id)
        })
        .slice('comments',-5)
        .populate('comments')
        .exec(function(err, team) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })}
            if (!team) 
            {
              res.status(401).json({
                    error:"Invalid team"
                });
            }
            req.team = team;
            next();
        });
    }
    else{
        next();
    }
   
};

/************************************************************************************
 *          Team searching by name
 **************************************************************************************/

exports.searchByName = function(req, res){
    var regex = new RegExp(req.params.name, 'gi');
    Team.find({name:regex})
     //.sort({createdAt:-1})
    .limit(req.query.limit||50)
    .exec(function(err, list){
       if(err) res.status(401).json({err: err})
       if (list) {
        res.status(200).json(list)
       }
    })
}


/************************************************************************************
 *    <POST> Share team profile : /players/TEAM_ID/share
 *    https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin will be used on client side
 *    for social media sharing, this endpoint will be removed
 **************************************************************************************/
//TODO
exports.shareTeamProfile = function(req, res){
  var team = req.team
  
}

/**
 *  Comment on team profile
 */
exports.comment = function(req, res) {
  var comment = new Comment(req.body)
  comment._user = req.user
  comment._team = req.team
  comment.save(function(err, comment) 
  {
    if(err) {
      res.status(500).json({
          success:false,
          error: err
      })
    }
    var team = req.team;
    if (team.comments == null) {
      team.comments = []
    }
    team.comments.push(comment._id)
    team.save(function(err){
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





