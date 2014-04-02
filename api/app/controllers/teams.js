/**
 * This controller is for the Team object of the API, for security reasons
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Team = mongoose.model('Team')

/**
 * Create a new team
 */
exports.create = function(req, res) {
    var team = new Team(req.body)           
    Team.save(function(err) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Team creation succeeded!'})
    })
};


/**
 * Update a team
 */
exports.update = function(req, res){    
    var team = req.team
    team = _.extend(team, req.body)
    logger.debug("Team to update %s ", team)
    Team.save(function(err, team) {
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
    Team.findOne({
            _id: req.params.teamId
        })
        .exec(function(err, team) {
            if (err) {
                res.status(500).json( {
                    success:false,
                    error: err
                });
            } else {
                res.json(team);
            }
    });
   
};

/**
 *  Remove team
 */
exports.destroy = function(req, res) {    
    var team = req.team;

    Team.remove(function(err) {
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
 * Find team by d param
 */
exports.team = function(req, res, next, id) {
    logger.debug('Team id parameter: %s', id)
    if(id)
    {
        Team.findOne({
            _id: new ObjectId(id)
        })
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


