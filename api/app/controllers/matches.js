/**
 * This controller is for the Match object of the API, for security reasons
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Match = mongoose.model('Match')
  , ObjectId = mongoose.Types.ObjectId
  , logger = require('winston')
  
/************************************************************************************
 *         list all scores
 **************************************************************************************/

exports.scores = function(req, res) {
    Match.find({})
        .populate('_team1 _team2')
        .sort({createdAt:-1})
        .skip(req.query.skip||0)
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
 * Create a new match
 */
exports.create = function(req, res) {
    var match = new Match(req.body)           
    match.save(function(err, match2) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Match creation succeeded! :' + match2._id})
    })
};


/**
 * Update a match
 */
exports.update = function(req, res){    
    var match = req.match
    match = _.extend(match, req.body)
    logger.debug("Match to update %s ", match)
    match.save(function(err, match) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(match)
        {
            logger.debug("Match updated with success")
            res.status(200).json(match)
        }        
  })
}

/**
 *  Show match
 */
exports.show = function(req, res) {    
    Match.findOne({
            _id: req.params.matchId
        })
        .populate('_team1 _team2')
        .exec(function(err, match) {
            if (err) {
                res.status(500).json( {
                    success:false,
                    error: err
                });
            } else {
                res.json(match);
            }
    });
   
};

/**
 *  Remove match
 */
exports.destroy = function(req, res) {    
    var match = req.match;
    match.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(200).json({message: match._id.toString + 'succesfully removed !'});
        }
    });
   
};


/**
 * Find match by id param
 */
exports.match = function(req, res, next, id) {
    logger.debug('Match id parameter: %s', id)
    if(id)
    {
        Match.findOne({
            _id: new ObjectId(id)
        })
        .exec(function(err, match) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })}
            if (!match) 
            {
              res.status(401).json({
                    error:"Invalid match"
                });
            }
            req.match = match;
            next();
        });
    }
    else{
        next();
    }
   
};


