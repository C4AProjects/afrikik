/**
 * This controller is for the player object of the API
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , Player = mongoose.model('Player')
  , logger = require('winston')
  , ObjectId = mongoose.Types.ObjectId;

/**
 * Create a new player
 */
exports.create = function(req, res) {
    var player = new Player(req.body)    
    player.save(function(err, player) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      else{
        res.status(201).json({succes: true, message:'Player creation succeeded!', item: player})
      }      
    })
};


/**
 * Update a player
 */
exports.update = function(req, res){    
    var player = req.player
    player = _.extend(player, req.body)
    logger.debug("User to update %s ", player)
    player.save(function(err, player) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(player)
        {
            logger.debug("Player updated with success")
            res.status(200).json(player)
        }        
  })
}

/**
 *  Show player
 */
exports.show = function(req, res) {
    Player.findOne({
            _id: req.params.playerId
        })
        .exec(function(err, player) {
            if (err) {
                res.status(500).json( {
                    success:false,
                    error: err
                });
            } else {
                res.json(player);
            }
    });
   
};

/**
 *  Get all players
 */
exports.all = function(req, res) {
    Player.find({})
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
 *  Remove player
 */
exports.destroy = function(req, res) {    
    var player = req.player;
    player.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(204).json({message: player.name + 'succesfully removed !'});
        }
    });
   
};

/**
 * Find player by id param
 */
exports.player = function(req, res, next, id) {
    logger.debug('Player id parameter: %s', id)
    if(id)
    {
        Player.findOne({
            _id: new ObjectId(id)
        })
        .exec(function(err, player) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })}
            if (!player) 
            {
              res.status(401).json({
                    error:"Invalid player"
                });
            }
            req.player = player;
            next();
        });
    }
    else{
        next();
    }
   
};

/************************************************************************************
 *          Player searching by name
 **************************************************************************************/

exports.searchByName = function(req, res){
    var regex = new RegExp(req.params.name, 'gi');
    Player
    .find({name:regex})
    //.sort({createdAt:-1})
    .limit(req.query.limit||50)
    .exec(function(err, list){
       if(err) res.status(401).json({err: err})
       if (list) {
        res.status(200).json(list)
       }
    })
}

exports.searchPlayersAndTeam = function(req, res){
    var regex = new RegExp(req.params.name, 'gi')
    , result = []
    
    Player
    .find({name:regex})
    //.sort({createdAt:-1})
    .limit(req.query.limit||50)
    .exec(function(err, list){
       if(err) res.status(401).json({err: err})
       if (list) {
        result= list
       }
    })
    
    Team = mongoose.model('Team')
    var regex = new RegExp(req.params.name, 'gi');
    Team.find({name:regex})     
    .limit(req.params.limit||10)
    .exec(function(err, list){
       if(err) res.status(401).json({err: err})
       if (list) {
        result.concat(list) //  concat with the players
       }
    })
    //sort the results by name   
    result.sort(function (a, b) {
        if (a.name > b.name)
          return 1;
        if (a.name < b.name)
          return -1;        
        return 0;
    })
    //TODO async module will be used for this function
    setTimeout(function(){
      res.status(200).json(result)
    }, 1000)
    
}

/************************************************************************************
 *          Get all players's team for a user : /users/USER_ID/teams/TEAM_ID/players
 **************************************************************************************/

exports.getPlayersTeam = function(req, res){
  var user = req.user
  if (user.subscribedTeams.indexOf(req.params.teamId)>0) {
    Player.find({_team: req.team._id})
    .populate('_team')
    .exec(function(err, list){
        if(err) res.status(401).json({err: err})        
        res.status(200).json(list)
    })     
  }
  else
  {
    res.status(401).json({err:  req.params.teamId + ' doesn\'t exist in subscribed team list!', subcribedTeams: user.subscribedTeams }) 
  }
}

/************************************************************************************
 *    <POST> Share player profile : /players/PLAYER_ID/share
 **************************************************************************************/
//TODO
exports.sharePlayerProfile = function(req, res){
  var player = req.player
  
}



