/**
 * This controller is for the player object of the API, for security reasons
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , Player = mongoose.model('Player')

/**
 * Create a new player
 */
exports.create = function(req, res) {
    var player = new Player(req.body)           
    player.save(function(err) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Player creation succeeded!'})
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
            res.status(204).json({message: player.fullName + 'succesfully removed !'});
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
    .find({fullName:regex})
    //.sort({createdAt:-1})
    .limit(req.params.limit||10)
    .exec(function(err, list){
       if(err) res.status(401).json({err: err})
       if (list) {
        res.status(200).json(list)
       }
    })
}


